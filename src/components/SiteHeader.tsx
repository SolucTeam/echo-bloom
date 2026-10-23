import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Heart, Leaf } from "lucide-react";
import { groupProjectMenu } from '@/lib/projects';
import { useSetting } from './ManagedSite';

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/projets", label: "Projets" },
  { to: "/galerie", label: "Galerie" },
  { to: "/blog", label: "Blog" },
  { to: "/nous-joindre", label: "Contact" },
  { to: "/devenir-partenaire", label: "Devenir partenaire" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const siteName=useSetting('site.name','Green Ivory'),logo=useSetting('site.logo'),donation=useSetting('site.donation','/faire-un-don');
  const menuValue=useSetting('site.menu');
  let menu:{to:string,label:string}[]=[...nav];
  try { if(menuValue)menu=groupProjectMenu(JSON.parse(menuValue) as {url:string,label:string}[]).map(n=>({to:n.url,label:n.label})); }catch{}
  useEffect(()=>{
    if(!open)return;
    const onKey=(e:KeyboardEvent)=>{ if(e.key==='Escape')setOpen(false); };
    window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[open]);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          {logo?<img src={logo} alt="" className="h-9 w-9 object-contain"/>:<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </span>}
          <span>{siteName}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {menu.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-full hover:bg-accent hover:text-foreground transition-colors"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to={donation} className="btn-primary hidden sm:inline-flex !py-2.5 !px-5">
            <Heart className="h-4 w-4" /> Faire un don
          </Link>
          <button
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-border"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="lg:hidden border-t border-border bg-background">
          <div className="container-x py-4 flex flex-col gap-1">
            {menu.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-sm font-medium rounded-xl hover:bg-accent"
                activeProps={{ className: "text-primary font-semibold bg-accent" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link to={donation} onClick={() => setOpen(false)} className="btn-primary mt-2">
              <Heart className="h-4 w-4" /> Faire un don
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
