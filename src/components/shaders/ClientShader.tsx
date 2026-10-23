import { Suspense, lazy, useEffect, useRef, useState } from "react";

/**
 * Client-only bridge to the `shaders` (WebGPU) library.
 *
 * The visual presets live in `./presets.tsx`, which statically imports
 * `shaders/react`. That file is only fetched in the browser, after this
 * component has mounted and the environment checks pass, so the server
 * bundle never loads the library and SSR output stays unchanged.
 *
 * Rendering gates, in order:
 * 1. mounted (never renders during SSR or hydration),
 * 2. WebGPU available and `prefers-reduced-motion` not set,
 * 3. desktop-class devices only (small screens and low-core devices skip
 *    decorative layers to save GPU/battery),
 * 4. the target is near the viewport (IntersectionObserver).
 */

export type ShaderPreset = "cardDuotone" | "heroAmbient";

const presetLoaders: Record<ShaderPreset, () => Promise<{ default: React.ComponentType<{ image?: string }> }>> = {
  // On the server the preset never renders, so resolve to a no-op component;
  // this also keeps the shaders library out of the server bundle entirely.
  cardDuotone: () =>
    import.meta.env.SSR
      ? Promise.resolve({ default: () => null })
      : import("./presets").then((m) => ({ default: m.DuotoneCard })),
  heroAmbient: () =>
    import.meta.env.SSR
      ? Promise.resolve({ default: () => null })
      : import("./presets").then((m) => ({ default: m.HeroAmbient })),
};

const presetCache = new Map<ShaderPreset, React.LazyExoticComponent<React.ComponentType<{ image?: string }>>>();

function getPreset(name: ShaderPreset) {
  let component = presetCache.get(name);
  if (!component) {
    component = lazy(presetLoaders[name]);
    presetCache.set(name, component);
  }
  return component;
}

export function ClientShader({
  preset,
  className,
  image,
}: {
  preset: ShaderPreset;
  /** Placement and opacity classes; the canvas fills this box. */
  className?: string;
  /** Image URL forwarded to image-based presets. */
  image?: string;
}) {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Preset = getPreset(preset);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("gpu" in navigator)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lowEnd = (navigator.hardwareConcurrency ?? 8) <= 2;
    const smallScreen = window.matchMedia("(max-width: 767px)").matches;
    if (lowEnd || smallScreen) return;
    setSupported(true);
  }, []);

  useEffect(() => {
    if (!supported) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [supported]);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {active && (
        <Suspense fallback={null}>
          <Preset image={image} />
        </Suspense>
      )}
    </div>
  );
}
