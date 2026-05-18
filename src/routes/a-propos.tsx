import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, Target, Eye, Heart } from "lucide-react";
import founder from "@/assets/founder.jpg";
import plastic from "@/assets/plastic.jpg";
import biodiv from "@/assets/biodiversity.jpg";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Green Ivory" },
      { name: "description", content: "Découvrez l’histoire, la mission et la vision de Green Ivory, ONG ivoirienne fondée en 2017 pour la protection de l’environnement." },
      { property: "og:title", content: "À propos de Green Ivory" },
      { property: "og:description", content: "Sept ans d’action environnementale en Côte d’Ivoire." },
      { property: "og:url", content: "https://greenivory-reborn.lovable.app/a-propos" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://greenivory-reborn.lovable.app/a-propos" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="Tout savoir de nous"
        title="Nous sommes engagés contre la pollution plastique."
        intro="Plus de 7 ans d’action environnementale en Côte d’Ivoire, au service des jeunes, des communautés et de la planète."
      />

      <section className="container-x py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <img src={plastic} alt="Nettoyage" loading="lazy" className="bento h-[420px] w-full object-cover" />
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold">Protéger l’environnement et réduire la pollution plastique</h2>
          <p className="mt-5 text-muted-foreground">
            Nous œuvrons pour diminuer l’impact des déchets plastiques et promouvoir des modes de vie
            respectueux de la planète. En Côte d’Ivoire, nous menons des opérations de nettoyage,
            de tri et de recyclage.
          </p>
          <h3 className="mt-8 text-xl font-semibold">Sensibiliser et éduquer les communautés</h3>
          <p className="mt-3 text-muted-foreground">
            À travers des programmes scolaires, ateliers et événements publics, nous encourageons
            chaque citoyen, des plus jeunes aux plus âgés, à adopter des comportements écoresponsables.
          </p>
        </div>
      </section>

      <section className="container-x py-16 grid md:grid-cols-3 gap-6">
        <ValueCard icon={<Target className="h-5 w-5" />} title="Notre mission" text="Protéger l’environnement à travers des actions concrètes contre la pollution plastique, la perte de biodiversité et le changement climatique." />
        <ValueCard icon={<Eye className="h-5 w-5" />} title="Notre vision" text="Une Côte d’Ivoire — et une Afrique — où la jeunesse est actrice d’une économie verte, juste et durable." />
        <ValueCard icon={<Heart className="h-5 w-5" />} title="Nos valeurs" text="Engagement citoyen, transparence, inclusion des jeunes, respect du vivant, et collaboration." />
      </section>

      <section className="container-x py-16 lg:py-24 grid lg:grid-cols-5 gap-10 items-center">
        <div className="lg:col-span-2">
          <img src={founder} alt="Khérann YAO, Président" loading="lazy" className="bento h-[520px] w-full object-cover" />
        </div>
        <div className="lg:col-span-3">
          <span className="eyebrow">Notre histoire</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold">De la passion à l’action.</h2>
          <p className="mt-5 text-muted-foreground">
            Fondée en 2017 par un collectif de jeunes ivoiriens passionnés par l’environnement,
            Green Ivory est née d’un constat simple : la pollution plastique et la dégradation des
            écosystèmes menacent notre avenir commun. Depuis, nous avons formé des milliers de jeunes,
            organisé des centaines d’opérations de terrain et porté la voix de la jeunesse ivoirienne
            jusque dans les grandes conférences internationales (COP).
          </p>
          <p className="mt-4 text-muted-foreground">
            L’ONG est dirigée par <strong className="text-foreground">Khérann YAO</strong>,
            Jeune Ambassadeur de l’UNICEF pour l’Environnement (2018), entouré d’une équipe
            pluridisciplinaire et de bénévoles dévoués.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/devenir-benevole" className="btn-primary">Devenir bénévole <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/nous-joindre" className="btn-ghost">Nous contacter</Link>
          </div>
        </div>
      </section>

      <section className="container-x pb-16 lg:pb-24">
        <img src={biodiv} alt="Forêt" loading="lazy" className="bento h-[360px] w-full object-cover" />
      </section>
    </>
  );
}

function ValueCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bento p-7">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">{icon}</span>
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
