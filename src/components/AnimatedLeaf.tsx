/**
 * Feuille graphique animée (SVG) de la page 404 — technique du skill
 * svg-animation : « stroke draw-on » avec pathLength="1" (longueurs
 * normalisées, aucun JS), en **cycle continu infini** :
 *
 *   pousse (pétiole → nervure → limbe → nervures) ≈ 3,8 s
 *   → vie pleinement formée avec ondulation ≈ 1,8 s
 *   → effacement en sens inverse (nervures → limbe → pétiole, retour à la
 *     graine) ≈ 2,5 s
 *   → pause ≈ 1,9 s, puis la feuille repousse.
 *
 * - 100 % CSS : aucun rAF ni état React ; chaque élément suit ses propres
 *   keyframes en pourcentages sur un cycle commun de 10 s.
 * - prefers-reduced-motion : animations désactivées, état final statique
 *   (feuille complète) affiché directement.
 * - Couleur via currentColor : hérite de la classe text-* de l'appelant.
 */

const CYCLE_CSS = `
.gl-draw{fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1.05;stroke-dashoffset:1.06}
.gl-petiole{animation:gl-petiole 10s infinite}
.gl-midrib{animation:gl-midrib 10s infinite}
.gl-outline{animation:gl-outline 10s infinite}
.gl-vein-up{animation:gl-vein-up 10s infinite}
.gl-vein-down{animation:gl-vein-down 10s infinite}
.gl-fill{fill:currentColor;opacity:0;animation:gl-fillcycle 10s infinite}
.gl-sway{transform-box:view-box;transform-origin:58px 70px;animation:gl-sway 5.6s ease-in-out infinite}
@keyframes gl-petiole{0%{stroke-dashoffset:1.06;animation-timing-function:cubic-bezier(.33,1,.68,1)}6%{stroke-dashoffset:0}76%{stroke-dashoffset:0;animation-timing-function:ease-in}81%,100%{stroke-dashoffset:1.06}}
@keyframes gl-midrib{0%,4%{stroke-dashoffset:1.06;animation-timing-function:cubic-bezier(.33,1,.68,1)}13%{stroke-dashoffset:0}72%{stroke-dashoffset:0;animation-timing-function:ease-in}77%,100%{stroke-dashoffset:1.06}}
@keyframes gl-outline{0%,10%{stroke-dashoffset:1.06;animation-timing-function:cubic-bezier(.33,1,.68,1)}27%{stroke-dashoffset:0}62%{stroke-dashoffset:0;animation-timing-function:ease-in}72%,100%{stroke-dashoffset:1.06}}
@keyframes gl-vein-up{0%,26%{stroke-dashoffset:1.06;animation-timing-function:cubic-bezier(.33,1,.68,1)}35%{stroke-dashoffset:0}55%{stroke-dashoffset:0;animation-timing-function:ease-in}62%,100%{stroke-dashoffset:1.06}}
@keyframes gl-vein-down{0%,29%{stroke-dashoffset:1.06;animation-timing-function:cubic-bezier(.33,1,.68,1)}38%{stroke-dashoffset:0}52%{stroke-dashoffset:0;animation-timing-function:ease-in}59%,100%{stroke-dashoffset:1.06}}
@keyframes gl-fillcycle{0%,28%{opacity:0}38%{opacity:.08}52%{opacity:.08}60%,100%{opacity:0}}
@keyframes gl-sway{0%,100%{transform:rotate(0deg)}30%{transform:rotate(2.2deg)}70%{transform:rotate(-2.2deg)}}
@media (prefers-reduced-motion:reduce){
  .gl-petiole,.gl-midrib,.gl-outline,.gl-vein-up,.gl-vein-down,.gl-fill,.gl-sway{animation:none}
  .gl-draw{stroke-dashoffset:0}
  .gl-fill{opacity:.08}
}
`;

export function AnimatedLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 140" className={className} aria-hidden="true" focusable="false">
      <style>{CYCLE_CSS}</style>
      <g className="gl-sway">
        {/* Limbe (remplissage léger, en fondu) */}
        <path
          className="gl-fill"
          d="M58,70 C78,24 162,14 224,70 C162,126 78,116 58,70 Z"
        />
        {/* Pétiole */}
        <path className="gl-draw gl-petiole" pathLength={1} d="M12,74 Q34,64 58,70" />
        {/* Nervure centrale */}
        <path className="gl-draw gl-midrib" pathLength={1} d="M58,70 Q142,76 224,70" />
        {/* Contour du limbe */}
        <path className="gl-draw gl-outline" pathLength={1}
          d="M58,70 C78,24 162,14 224,70 C162,126 78,116 58,70 Z" />
        {/* Nervures secondaires (paires, inclinées vers la pointe) */}
        <path className="gl-draw gl-vein-up" pathLength={1} d="M86,71 Q108,52 124,42" />
        <path className="gl-draw gl-vein-up" pathLength={1} d="M114,71 Q134,56 150,48" />
        <path className="gl-draw gl-vein-up" pathLength={1} d="M142,71 Q159,60 174,55" />
        <path className="gl-draw gl-vein-up" pathLength={1} d="M170,71 Q185,64 198,62" />
        <path className="gl-draw gl-vein-down" pathLength={1} d="M86,69 Q108,88 124,98" />
        <path className="gl-draw gl-vein-down" pathLength={1} d="M114,69 Q134,84 150,92" />
        <path className="gl-draw gl-vein-down" pathLength={1} d="M142,69 Q159,80 174,85" />
        <path className="gl-draw gl-vein-down" pathLength={1} d="M170,69 Q185,76 198,78" />
      </g>
    </svg>
  );
}
