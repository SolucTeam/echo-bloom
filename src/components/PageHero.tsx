export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="border-b border-border bg-accent/40">
      <div className="container-x py-16 lg:py-24">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl">{title}</h1>
        {intro && <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{intro}</p>}
      </div>
    </section>
  );
}
