import { Link } from "@tanstack/react-router";
import { Calendar, Building2, Rocket, Heart, Handshake, CheckCircle2 } from "lucide-react";

export interface ProjectInfo {
  eyebrow: string;
  title: string;
  tagline: string;
  org: string;
  launched: string;
  pilot: string;
  firstEdition: string;
  goal: string;
  goalDetail: string;
  hero: string;
  context: string;
  objectives: string[];
  outcomes: { label: string; value: string }[];
}

export function ProjectLayout({ info }: { info: ProjectInfo }) {
  return (
    <>
      <section className="border-b border-border bg-accent/40">
        <div className="container-x py-14 lg:py-20 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow">{info.eyebrow}</span>
            <h1 className="mt-4 text-4xl lg:text-6xl font-bold tracking-tight">{info.title}</h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{info.tagline}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/faire-un-don" className="btn-primary"><Heart className="h-4 w-4" /> Faire un don</Link>
              <Link to="/devenir-partenaire" className="btn-ghost"><Handshake className="h-4 w-4" /> Devenir un sponsor</Link>
            </div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <Meta icon={<Building2 className="h-4 w-4" />} label="Organisation" value={info.org} />
            <Meta icon={<Calendar className="h-4 w-4" />} label="Lancement" value={info.launched} />
            <Meta icon={<Rocket className="h-4 w-4" />} label="Phase pilote" value={info.pilot} />
            <Meta icon={<Calendar className="h-4 w-4" />} label="1ʳᵉ édition" value={info.firstEdition} />
          </div>
        </div>
      </section>

      <section className="container-x py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold">{info.goal}</h2>
          <p className="mt-5 text-muted-foreground text-lg">{info.goalDetail}</p>
        </div>
        <img src={info.hero} alt={info.title} loading="lazy" className="bento h-[420px] w-full object-cover" />
      </section>

      <section className="container-x py-16 lg:py-24 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <span className="eyebrow">Contexte</span>
          <h3 className="mt-3 text-3xl font-bold">Pourquoi ce projet&nbsp;?</h3>
          <p className="mt-5 text-muted-foreground whitespace-pre-line">{info.context}</p>

          <h3 className="mt-12 text-2xl font-bold">Objectifs spécifiques</h3>
          <ul className="mt-5 space-y-3">
            {info.objectives.map((o) => (
              <li key={o} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                <span className="text-foreground/90">{o}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="bento p-7 bg-primary text-primary-foreground border-0 h-fit lg:sticky lg:top-24">
          <h4 className="text-lg font-semibold">Résultats attendus</h4>
          <div className="mt-5 space-y-5">
            {info.outcomes.map((o) => (
              <div key={o.label}>
                <div className="text-3xl font-bold">{o.value}</div>
                <div className="text-sm opacity-85 mt-1">{o.label}</div>
              </div>
            ))}
          </div>
          <Link to="/faire-un-don" className="mt-7 inline-flex w-full justify-center items-center gap-2 rounded-full bg-leaf text-primary px-5 py-3 text-sm font-semibold hover:opacity-90">
            Soutenir ce projet
          </Link>
        </aside>
      </section>
    </>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bento p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-1 font-semibold text-lg">{value}</div>
    </div>
  );
}
