import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/**
 * Révèle son contenu à la première entrée dans l'écran : montée derrière un masque + fondu.
 * SSR / sans JS : visible par défaut — l'élément n'est masqué que s'il est hors écran au
 * chargement (aucun flash possible). Statique si « Réduire les animations » est activé.
 */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('reveal-in');
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    // Au chargement : ne masquer que ce qui n'est pas encore visible à l'écran.
    const alreadyInView = io.takeRecords().some((entry) => entry.isIntersecting);
    if (!alreadyInView) el.classList.add('reveal-armed');
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className ? `reveal ${className}` : 'reveal'}>
      <div className="reveal-inner" style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}>
        {children}
      </div>
    </div>
  );
}
