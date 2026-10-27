import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation } from '@tanstack/react-router';
import { tr, trLabel, trMsg, type DictKey, type Lang } from '@/lib/i18n';

const COOKIE = 'gi_lang';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey, params?: Record<string, string | number>) => string;
  tLabel: (label: string) => string;
  tMsg: (msg: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: (key) => tr('fr', key),
  tLabel: (label) => label,
  tMsg: (msg) => msg,
});

/**
 * Fournisseur de langue : état initial « fr » côté serveur ET client (aucune lecture
 * de cookie pendant le rendu) pour garantir une hydratation sans décalage. Le cookie
 * `gi_lang` est lu après le montage : les visiteurs anglophones voient un court
 * instant la version française avant la bascule — compromis accepté pour ce site.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');
  const langRef = useRef<Lang>('fr');
  const fadeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const saved = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=(fr|en)`))?.[1];
    if (saved === 'fr' || saved === 'en') {
      langRef.current = saved;
      setLangState(saved);
    }
  }, []);

  // Synchronise l'attribut lang du document avec la langue affichée.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /**
   * Changement de langue adouci : un voile d'opacité très court est posé avant
   * l'échange des textes puis retiré, si bien que le reflow massif se perçoit
   * comme un fondu discret et non comme un saut. « Réduire les animations » :
   * échange immédiat, sans voile.
   */
  const setLang = useCallback((l: Lang) => {
    if (langRef.current === l) return;
    langRef.current = l;
    document.cookie = `${COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLangState(l);
      return;
    }
    const root = document.documentElement;
    root.classList.add('lang-fade');
    window.clearTimeout(fadeTimer.current);
    fadeTimer.current = window.setTimeout(() => {
      setLangState(l);
      root.classList.remove('lang-fade');
    }, 180);
  }, []);

  /**
   * Méta par langue (phase 3 bilingue) : head() sert toujours les méta françaises
   * au serveur et émet, quand elles existent, les versions anglaises dans des
   * balises porteuses `x-title-en` / `x-description-en`. Côté client, un visiteur
   * en anglais voit le titre d'onglet et la description échangés contre ces
   * versions ; les méta françaises d'origine sont mémorisées pour être rendues
   * au retour en français. Sans balises porteuses, rien n'est échangé. Les
   * balises og/twitter restent françaises : elles sont lues par les robots sur
   * le HTML serveur, où la langue n'est pas encore connue.
   */
  const location = useLocation();
  const originalMeta = useRef<{ title: string; description: string | null } | null>(null);
  const prevPath = useRef<string | null>(null);
  useEffect(() => {
    // Nouvelle page : le head vient de rendre ses méta françaises, on repart de zéro.
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;
      originalMeta.current = null;
    }
    const desc = document.querySelector('meta[name="description"]');
    const saved = originalMeta.current;
    if (lang === 'fr') {
      if (saved) {
        document.title = saved.title;
        if (desc && saved.description !== null) desc.setAttribute('content', saved.description);
      }
      originalMeta.current = null;
      return;
    }
    const readEn = () => ({
      title: document.querySelector('meta[name="x-title-en"]')?.getAttribute('content')?.trim() || '',
      desc: document.querySelector('meta[name="x-description-en"]')?.getAttribute('content')?.trim() || '',
    });
    const en = readEn();
    if (!en.title && !en.desc) {
      originalMeta.current = null;
      return;
    }
    if (!originalMeta.current) {
      originalMeta.current = { title: document.title, description: desc?.getAttribute('content') ?? null };
    }
    const apply = () => {
      if (en.title && document.title !== en.title) document.title = en.title;
      const d = document.querySelector('meta[name="description"]');
      if (en.desc && d && d.getAttribute('content') !== en.desc) d.setAttribute('content', en.desc);
    };
    apply();
    /**
     * Le gestionnaire de head de TanStack réécrit les méta françaises à chaque
     * rendu de route (par exemple lors du re-render déclenché par la bascule de
     * langue) : on ré-applique la version anglaise à chaque écriture. La garde
     * « différent de la cible » empêche toute boucle : notre propre écriture ne
     * provoque plus rien.
     */
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, attributeFilter: ['content'] });
    return () => observer.disconnect();
  }, [lang, location.pathname]);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      t: (key, params) => tr(lang, key, params),
      tLabel: (label) => trLabel(lang, label),
      tMsg: (msg) => trMsg(lang, msg),
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}

/** Helper de traduction lié à la langue courante : const t = useT(); t('nav.donate'). */
export function useT() {
  return useLang().t;
}

/** Drapeau français (tricolore) en SVG inline : net à toute taille, sans ressource externe. */
function FlagFR() {
  return (
    <svg viewBox="0 0 3 2" className="h-full w-full" aria-hidden="true">
      <rect width="1" height="2" fill="#0055A4" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#EF4135" />
    </svg>
  );
}

/** Drapeau du Royaume-Uni (Union Jack simplifié) en SVG inline. */
function FlagEN() {
  return (
    <svg viewBox="0 0 60 40" className="h-full w-full" aria-hidden="true">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 V40 M0,20 H60" stroke="#FFFFFF" strokeWidth="13" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
    </svg>
  );
}

const FLAGS = { fr: FlagFR, en: FlagEN } as const;
const LANG_NAMES = { fr: 'Français', en: 'English' } as const;

/**
 * Bascule FR / EN de l'en-tête : deux drapeaux (SVG inline) avec leur code,
 * choix mémorisé dans le cookie `gi_lang`. Le drapeau actif est mis en valeur
 * (pastille pleine) ; chacun garde son libellé accessible.
 */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-full border border-border bg-background/60 p-1 ${className}`}
      role="group"
      aria-label="Choix de la langue / Language selection"
    >
      {(['fr', 'en'] as const).map((l) => {
        const Flag = FLAGS[l];
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            aria-label={LANG_NAMES[l]}
            title={LANG_NAMES[l]}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground/60 hover:bg-accent hover:text-foreground'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 shrink-0 overflow-hidden rounded-full ring-1 transition-shadow ${
                active ? 'ring-white/50' : 'ring-black/10'
              }`}
            >
              <Flag />
            </span>
            {l}
          </button>
        );
      })}
    </div>
  );
}
