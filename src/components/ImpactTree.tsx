// Arbre d'impact — un arbre SVG qui pousse avec le montant choisi sur la page dons.
// La croissance g ∈ [0,1] pilote l'échelle de chaque partie (tronc, houppier) via des
// transform d'origine ancrée (base du tronc, centre des houppiers). Transition CSS
// douce, désactivée en mouvement réduit : l'état final s'affiche instantanément.
// La pousse est animée seulement si le mouvement est autorisé (voir styles.css).
export function ImpactTree({ growth, className }: { growth: number; className?: string }) {
  const g = Math.min(1, Math.max(0, growth));
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const trunk = 0.25 + 0.75 * g;
  const crowns = [
    { cx: 110, cy: 92, r: 36, fill: '#2d5a3d', s: 0.3 + 0.7 * g },
    { cx: 82, cy: 116, r: 24, fill: '#5a8a5c', s: clamp01(g * 1.15) },
    { cx: 140, cy: 110, r: 26, fill: '#a0c49d', s: clamp01(g * 1.15 - 0.15) },
  ];
  return (
    <svg viewBox="0 0 220 232" className={className} aria-hidden="true" focusable="false">
      {/* Monticule */}
      <ellipse cx="110" cy="210" rx="46" ry="10" fill="#e6eedb" />
      <ellipse cx="110" cy="208" rx="30" ry="6" fill="#d7e4c9" />
      {/* Tronc + branches, ancrés à la base */}
      <g
        stroke="#1a3c2a" strokeWidth="7" strokeLinecap="round" fill="none"
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', transform: `scale(${trunk})` }}
        className="impact-tree-grow"
      >
        <path d="M110 204 C 108 176, 112 152, 110 118" />
        <path d="M110 156 C 101 146, 95 140, 89 132" strokeWidth="5" />
        <path d="M110 140 C 119 132, 125 126, 131 118" strokeWidth="5" />
      </g>
      {/* Houppier : trois bouffées de feuillage à croissance décalée */}
      {crowns.map((c, i) => (
        <circle
          key={i} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} className="impact-tree-grow"
          style={{ transformBox: 'fill-box', transformOrigin: '50% 50%', transform: `scale(${c.s})` }}
        />
      ))}
    </svg>
  );
}
