/**
 * Feuilles flottantes du hero — silhouette de la marque (limbe + nervure,
 * mêmes tracés que la feuille animée de la page 404) en quelques exemplaires
 * qui dérivent lentement derrière le titre.
 *
 * - 100 % CSS : chaque feuille suit sa propre dérive (translate + rotation
 *   légère), désynchronisée par des délais négatifs ; aucune boucle JS.
 * - aria-hidden + pointer-events-none : purement décoratif, jamais cliquable.
 * - prefers-reduced-motion : animation désactivée, feuilles posées en statique.
 * - Couleur via currentColor : chaque exemplaire choisit sa teinte text-*.
 */

const LEAF_CSS = `
.hl-leaf{position:absolute;animation:hl-drift var(--d) ease-in-out var(--delay) infinite alternate}
.hl-leaf--b{animation-name:hl-drift-b}
@keyframes hl-drift{from{transform:translate3d(0,1.2rem,0) rotate(var(--r))}to{transform:translate3d(1.4rem,-2.2rem,0) rotate(calc(var(--r) + 10deg))}}
@keyframes hl-drift-b{from{transform:translate3d(0,-1rem,0) rotate(var(--r))}to{transform:translate3d(-1.6rem,1.8rem,0) rotate(calc(var(--r) - 12deg))}}
@media (prefers-reduced-motion:reduce){.hl-leaf{animation:none}}
`;

const LEAF_LIMBE = "M58,70 C78,24 162,14 224,70 C162,126 78,116 58,70 Z";
const LEAF_NERVURE = "M58,70 Q142,76 224,70";

const LEAVES = [
  { left: "3%", top: "16%", w: 66, d: "13s", delay: "-3s", r: "-18deg", b: false, cls: "text-primary/20" },
  { left: "9%", top: "64%", w: 92, d: "16s", delay: "-9s", r: "14deg", b: true, cls: "text-secondary/15" },
  { left: "21%", top: "7%", w: 46, d: "11s", delay: "-6s", r: "-8deg", b: false, cls: "text-leaf/50" },
  { left: "31%", top: "72%", w: 58, d: "14s", delay: "-1s", r: "22deg", b: true, cls: "text-primary/15" },
  { left: "45%", top: "26%", w: 72, d: "15s", delay: "-11s", r: "-24deg", b: true, cls: "text-secondary/20" },
  { left: "58%", top: "9%", w: 50, d: "12s", delay: "-4s", r: "10deg", b: false, cls: "text-leaf/40" },
  { left: "88%", top: "66%", w: 80, d: "17s", delay: "-7s", r: "-14deg", b: true, cls: "text-primary/15" },
];

export function FloatingLeaves({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <style>{LEAF_CSS}</style>
      {LEAVES.map((l, i) => (
        <svg
          key={i}
          viewBox="0 0 240 140"
          fill="none"
          stroke="currentColor"
          strokeWidth={6}
          strokeLinecap="round"
          className={`hl-leaf ${l.b ? "hl-leaf--b" : ""} ${l.cls}`}
          style={{
            left: l.left, top: l.top, width: l.w, height: (l.w * 140) / 240,
            ["--d" as string]: l.d, ["--delay" as string]: l.delay, ["--r" as string]: l.r,
          } as React.CSSProperties}
        >
          <path d={LEAF_LIMBE} />
          <path d={LEAF_NERVURE} />
        </svg>
      ))}
    </div>
  );
}
