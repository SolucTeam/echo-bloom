import { useRef, useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

// Comparateur avant/après — deux images superposées, la supérieure (avant) recadrée par
// clip-path. Pointeur avec capture, tactile et clavier (flèches ±2, Maj ±10, Début/Fin).
// Aucune animation automatique : le composant ne répond qu'à l'utilisateur, donc rien à
// désactiver en mouvement réduit.
export function BeforeAfter({
  before, after, beforeAlt, afterAlt, className,
}: {
  before: string; after: string; beforeAlt: string; afterAlt: string; className?: string;
}) {
  const [pos, setPos] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const setFromClientX = (clientX: number) => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };
  return (
    <div
      ref={boxRef}
      className={`relative aspect-[16/9] overflow-hidden select-none touch-none ${className ?? ''}`}
      onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); setFromClientX(e.clientX); }}
      onPointerMove={(e) => { if (dragging.current) setFromClientX(e.clientX); }}
      onPointerUp={(e) => { dragging.current = false; e.currentTarget.releasePointerCapture(e.pointerId); }}
      onPointerCancel={() => { dragging.current = false; }}
    >
      <img src={after} alt={afterAlt} draggable={false} className="h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt={beforeAlt} draggable={false} className="h-full w-full object-cover" />
      </div>
      <span className="absolute left-4 top-4 z-10 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">Avant</span>
      <span className="absolute right-4 top-4 z-10 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">Après</span>
      <div
        role="slider" tabIndex={0}
        aria-label="Comparateur avant / après"
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} aria-valuetext={`${Math.round(pos)} %`}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 2;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setPos((p) => Math.max(0, p - step)); }
          else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setPos((p) => Math.min(100, p + step)); }
          else if (e.key === 'Home') { e.preventDefault(); setPos(0); }
          else if (e.key === 'End') { e.preventDefault(); setPos(100); }
        }}
        className="group absolute inset-y-0 z-10 w-11 -translate-x-1/2 cursor-ew-resize focus:outline-none"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.25)]" />
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-1 ring-black/10 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
          <ChevronsLeftRight className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
