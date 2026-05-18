import { Link } from "@tanstack/react-router";
import { Facebook, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-x py-16 grid gap-12 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15">
              <Leaf className="h-5 w-5" />
            </span>
            Green Ivory
          </div>
          <p className="mt-4 text-sm opacity-80 max-w-xs">
            Le pouvoir citoyen pour l’environnement. ONG ivoirienne engagée contre la pollution plastique, pour la biodiversité et le climat depuis 2017.
          </p>
          <div className="mt-6 flex gap-3">
            {[Facebook, Linkedin, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/10 hover:bg-background/20 transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Liens utiles</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/a-propos">À propos</Link></li>
            <li><Link to="/projets/journees-sans-plastique">Journées sans Plastique</Link></li>
            <li><Link to="/projets/sentiers-verts">Sentiers Verts</Link></li>
            <li><Link to="/galerie">Galerie</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/devenir-benevole">Devenir bénévole</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Nous contacter</h4>
          <ul className="space-y-3 text-sm opacity-90">
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Côte d’Ivoire — Abidjan, Bingerville</span>
            </li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 mt-0.5 shrink-0" />
              <a href="tel:+22501030583 63" className="hover:underline">(+225) 01 03 05 83 63</a>
            </li>
            <li className="flex gap-2">
              <Mail className="h-4 w-4 mt-0.5 shrink-0" />
              <a href="mailto:info@greenivory.com" className="hover:underline">info@greenivory.com</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <p className="text-sm opacity-85 mb-4">
            Recevez chaque mois l’actualité de Green Ivory.
          </p>
          <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="Votre e-mail"
              className="w-full rounded-full bg-background/10 border border-background/20 px-4 py-3 text-sm placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-leaf"
            />
            <button className="rounded-full bg-leaf text-primary px-5 py-3 text-sm font-semibold hover:opacity-90 transition">
              Je m’abonne
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container-x py-5 text-xs opacity-70 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} Green Ivory — Tous droits réservés.</span>
          <span>Conçu avec ❤️ pour la planète.</span>
        </div>
      </div>
    </footer>
  );
}
