import { useEffect, useRef, useState } from 'react';

/**
 * Compteur animé : affiche la valeur finale dès le rendu serveur (SEO, sans JS),
 * puis anime la partie numérique de 0 à la cible quand l'élément entre dans le
 * viewport. Respecte prefers-reduced-motion (aucune animation, valeur finale).
 *
 * Formats gérés : « 15 000+ », « 2 500+ », « 45+ », « 7 ans », « 15k+ »…
 * La valeur d'origine est restaurée à la fin (espace insécable d'origine conservée).
 */
const NUM_PREFIX = /^(\d[\d\s\u202f\u00a0.,]*)(.*)$/;
const DURATION_MS = 1400;

export function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const match = value.match(NUM_PREFIX);
    if (!match) return;
    const target = parseInt(match[1].replace(/[^\d]/g, ''), 10);
    if (!Number.isFinite(target) || target <= 0) return;
    const suffix = match[2];

    let raf = 0;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const format = (n: number) => n.toLocaleString('fr-FR').replace(/\u202f/g, '\u00a0');
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION_MS, 1);
        if (t < 1) {
          setDisplay(format(Math.round(easeOut(t) * target)) + suffix);
          raf = requestAnimationFrame(tick);
        } else {
          setDisplay(value);
        }
      };
      raf = requestAnimationFrame(tick);
    }, { rootMargin: '120px' });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref} className="tabular-nums">{display}</span>;
}
