// Célébration « pluie de feuilles » — bursting de feuilles SVG aux couleurs de la marque,
// animées via la Web Animations API. Sans effet en préférence mouvement réduit, et sans
// dépendance : ~2 Ko de code maison, nettoyage automatique du DOM.
const LEAF_COLORS = ['#2d5a3d', '#5a8a5c', '#a0c49d', '#1a3c2a'];
const CLEANUP_MS = 1600;

export function leafBurst(x: number, y: number, count = 15) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden;';
  document.body.appendChild(container);
  for (let i = 0; i < count; i++) spawnLeaf(container, x, y);
  window.setTimeout(() => container.remove(), CLEANUP_MS);
}

function spawnLeaf(container: HTMLElement, x: number, y: number) {
  const size = 10 + Math.random() * 12;
  const color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
  const leaf = document.createElement('div');
  leaf.style.cssText = `position:absolute;left:${x}px;top:${y}px;will-change:transform,opacity;`;
  leaf.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="${color}"/></svg>`;
  container.appendChild(leaf);
  const dx = (Math.random() - 0.5) * 260;
  const rise = -(110 + Math.random() * 130);
  const fall = rise + 260 + Math.random() * 140;
  const spin = (Math.random() - 0.5) * 520;
  leaf.animate(
    [
      { transform: 'translate(0, 0) rotate(0deg) scale(0.6)', opacity: 0 },
      { transform: `translate(${dx * 0.5}px, ${rise}px) rotate(${spin * 0.6}deg) scale(1)`, opacity: 1, offset: 0.35 },
      { transform: `translate(${dx}px, ${fall}px) rotate(${spin}deg) scale(0.9)`, opacity: 0 },
    ],
    { duration: 900 + Math.random() * 600, easing: 'cubic-bezier(0.2, 0.6, 0.3, 1)' },
  );
}
