/**
 * Pages d'état du site — 404, erreur de chargement et maintenance —
 * partageant la même identité feuille et des animations 100 % CSS
 * (aucune boucle JS, aucune dépendance).
 *
 * Chaque scène désactive ses animations sous `prefers-reduced-motion`
 * et affiche directement un état final statique lisible.
 */
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { AnimatedLeaf } from '@/components/AnimatedLeaf';
import { FloatingLeaves } from '@/components/FloatingLeaves';
import { useLang } from '@/components/Language';

/** Silhouette feuille de la marque (limbe + nervure), colorée via currentColor. */
function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 140" fill="none" stroke="currentColor" strokeWidth={9} strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M58,70 C78,24 162,14 224,70 C162,126 78,116 58,70 Z" />
      <path d="M58,70 Q142,76 224,70" />
    </svg>
  );
}

/* ---------------------------------------------------------------- 404 */

export function NotFoundScene() {
  const { t } = useLang();
  return (
    <div className="relative overflow-hidden text-center space-y-5 max-w-xl mx-auto">
      <FloatingLeaves className="absolute -inset-10 pointer-events-none" />
      <div className="relative">
        <p className="text-[6.5rem] sm:text-[8rem] leading-none font-extrabold tracking-tighter bg-gradient-to-br from-primary via-secondary to-leaf bg-clip-text text-transparent select-none">404</p>
        <AnimatedLeaf className="mx-auto w-64 max-w-full h-auto -mt-4 text-primary/70 select-none" />
        <h1 className="text-3xl font-bold">{t('notfound.title')}</h1>
        <p className="text-muted-foreground">{t('notfound.text')}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button asChild><Link to="/">{t('notfound.backHome')}</Link></Button>
          <Button variant="outline" asChild><Link to="/programmes">{t('home.ctaDiscover')}</Link></Button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------- Erreur de chargement */

const ERROR_CSS = `
.ep-ring{animation:ep-spin 9s linear infinite}
.ep-core{animation:ep-breathe 3.2s ease-in-out infinite}
@keyframes ep-spin{to{transform:rotate(360deg)}}
@keyframes ep-breathe{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgb(160 196 157/.55)}50%{transform:scale(1.05);box-shadow:0 0 0 16px rgb(160 196 157/0)}}
@media (prefers-reduced-motion:reduce){.ep-ring,.ep-core{animation:none}}
`;

export function ErrorScene({ onRetry }: { onRetry: () => void }) {
  const { t } = useLang();
  return (
    <div className="text-center space-y-5 max-w-md mx-auto">
      <style>{ERROR_CSS}</style>
      <div className="relative mx-auto h-36 w-36 select-none" aria-hidden>
        <div className="ep-ring absolute inset-0 rounded-full border-2 border-dashed border-leaf" />
        <div className="ep-core absolute inset-4 rounded-full bg-accent grid place-items-center">
          <LeafMark className="w-16 h-auto text-secondary" />
        </div>
      </div>
      <h1 className="text-2xl font-bold">{t('error.title')}</h1>
      <p className="text-muted-foreground">{t('error.text')}</p>
      <div className="flex flex-wrap justify-center gap-3 pt-1">
        <Button onClick={onRetry}>{t('error.retry')}</Button>
        <Button variant="outline" asChild><Link to="/">{t('nav.home')}</Link></Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Maintenance */

const MAINT_CSS = `
.mt-sun{animation:mt-pulse 4s ease-in-out infinite}
.mt-rays{animation:mt-spin 44s linear infinite}
.mt-cloud-a{animation:mt-drift 26s ease-in-out infinite alternate}
.mt-cloud-b{animation:mt-drift 34s ease-in-out -9s infinite alternate-reverse}
.mt-drop{animation:mt-fall 4.5s ease-in infinite}
.mt-ripple{animation:mt-ripple 4.5s ease-out infinite}
.mt-stem{animation:mt-grow 9s ease-in-out infinite}
.mt-leaf-l{animation:mt-unfurl-l 9s ease-out infinite}
.mt-leaf-r{animation:mt-unfurl-r 9s ease-out infinite}
.mt-dots span{animation:mt-blink 1.6s ease-in-out infinite}
.mt-dots span:nth-child(2){animation-delay:.25s}
.mt-dots span:nth-child(3){animation-delay:.5s}
@keyframes mt-spin{to{transform:rotate(360deg)}}
@keyframes mt-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@keyframes mt-drift{from{transform:translateX(0)}to{transform:translateX(46px)}}
@keyframes mt-fall{0%,52%{transform:translate(-50%,-18px);opacity:0}58%{opacity:1}84%{transform:translate(-50%,118px);opacity:1}91%,100%{transform:translate(-50%,124px) scale(.7,.35);opacity:0}}
@keyframes mt-ripple{0%,82%{transform:translate(-50%,0) scale(0);opacity:0}88%{opacity:.75}100%{transform:translate(-50%,0) scale(1);opacity:0}}
@keyframes mt-grow{0%,12%{transform:translateX(-50%) scaleY(0);opacity:1}42%,80%{transform:translateX(-50%) scaleY(1);opacity:1}94%,100%{transform:translateX(-50%) scaleY(1);opacity:0}}
@keyframes mt-unfurl-l{0%,20%{transform:scale(0) rotate(-38deg)}50%,80%{transform:scale(1) rotate(-38deg);opacity:1}94%,100%{transform:scale(1) rotate(-38deg);opacity:0}}
@keyframes mt-unfurl-r{0%,26%{transform:scale(0) rotate(38deg)}56%,80%{transform:scale(1) rotate(38deg);opacity:1}94%,100%{transform:scale(1) rotate(38deg);opacity:0}}
@keyframes mt-blink{0%,100%{opacity:.25}45%{opacity:1}}
@media (prefers-reduced-motion:reduce){
  .mt-sun,.mt-rays,.mt-cloud-a,.mt-cloud-b,.mt-dots span{animation:none}
  .mt-drop,.mt-ripple{display:none}
  .mt-stem{animation:none;transform:translateX(-50%) scaleY(1)}
  .mt-leaf-l{animation:none;transform:scale(1) rotate(-38deg)}
  .mt-leaf-r{animation:none;transform:scale(1) rotate(38deg)}
}
`;

/** Scène de maintenance : soleil, nuages, goutte d'eau et une pousse qui
 *  grandit en boucle — le jardinage du site, en direct. */
export function MaintenanceScene({ onReload }: { onReload: () => void }) {
  const { t } = useLang();
  return (
    <div className="text-center space-y-6 max-w-lg mx-auto">
      <style>{MAINT_CSS}</style>
      <div className="bento relative overflow-hidden px-6 pt-12 pb-14" aria-hidden>
        {/* Soleil + rayons */}
        <div className="absolute top-7 right-8 h-16 w-16">
          <div className="mt-rays absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="absolute left-1/2 top-1/2 h-1.5 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-leaf/70" style={{ transform: `translate(-50%,-50%) rotate(${i * 45}deg) translateX(28px)` }} />
            ))}
          </div>
          <div className="mt-sun absolute inset-3 rounded-full bg-[#f0c46a]" />
        </div>
        {/* Nuages dérivants */}
        <div className="mt-cloud-a absolute top-9 left-7 flex">
          <span className="h-6 w-10 rounded-full bg-leaf/25" /><span className="-ml-3 -mt-3 h-8 w-8 rounded-full bg-leaf/25" />
        </div>
        <div className="mt-cloud-b absolute top-24 left-1/3 flex opacity-70">
          <span className="h-5 w-8 rounded-full bg-leaf/20" /><span className="-ml-2 -mt-2 h-6 w-6 rounded-full bg-leaf/20" />
        </div>
        {/* Scène : goutte, onde, pousse, terre */}
        <div className="relative mx-auto h-44 w-60">
          <span className="mt-drop absolute top-0 left-1/2 h-3 w-2 rounded-[50%_50%_60%_60%] bg-secondary" />
          <span className="mt-ripple absolute bottom-8 left-1/2 h-4 w-16 rounded-[50%] border-2 border-leaf" />
          <span className="mt-stem absolute bottom-9 left-1/2 h-16 w-[5px] rounded-full bg-secondary" />
          <span className="mt-leaf-l absolute bottom-[5.4rem] left-1/2 ml-[-2.7rem] h-5 w-9 rounded-[0_100%_0_100%] bg-leaf" />
          <span className="mt-leaf-r absolute bottom-[5.4rem] left-1/2 ml-[.4rem] h-5 w-9 rounded-[100%_0_100%_0] bg-leaf" />
          <span className="absolute bottom-4 left-1/2 h-7 w-32 -translate-x-1/2 rounded-[50%_50%_25%_25%/85%_85%_30%_30%] bg-primary" />
          <span className="absolute bottom-2 left-1/2 h-1 w-48 -translate-x-1/2 rounded-full border-b-2 border-border" />
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold">{t('maint.title')}</h1>
        <p className="mt-3 text-muted-foreground">{t('maint.text')}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t('maint.thanks')}<span className="mt-dots"><span>.</span><span>.</span><span>.</span></span></p>
      </div>
      <Button variant="outline" onClick={onReload}>{t('maint.reload')}</Button>
    </div>
  );
}

/** Page plein écran utilisée quand la maintenance est activée. */
export function MaintenancePage() {
  const { t } = useLang();
  return (
    <div className="relative min-h-svh overflow-hidden bg-background grid place-items-center px-4 py-16">
      <div className="absolute inset-0 grain opacity-40 pointer-events-none" aria-hidden />
      <FloatingLeaves className="absolute inset-0 -z-10 pointer-events-none" />
      <MaintenanceScene onReload={() => location.reload()} />
      <p className="absolute bottom-6 text-xs text-muted-foreground">Green Ivory — {t('maint.tagline')}</p>
    </div>
  );
}
