import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES } from "@/data/blog-posts";
import { EDITABLE_TEXTS, uploadMedia, type DbPost } from "@/lib/cms";
import { Check, LogOut, Trash2, Plus, Pencil } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Console d'administration — Green Ivory" },
      { name: "description", content: "Gestion des messages, articles, galerie et textes du site." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Administration — Green Ivory" },
      { property: "og:description", content: "Console d'administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const inputCls = "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm";
const fmt = (d: string) => new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });

function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return setIsAdmin(false);
      const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      setIsAdmin(!!ok);
    });
  }, []);
  const logout = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };

  if (isAdmin === null) return <div className="container-x py-24">Chargement…</div>;
  if (!isAdmin)
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-bold">Accès refusé</h1>
        <p className="mt-2 text-muted-foreground">Ce compte n'a pas les droits administrateur.</p>
        <button onClick={logout} className="btn-primary mt-6 inline-flex">Se déconnecter</button>
      </div>
    );

  return (
    <section className="container-x py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Console d'administration</h1>
        <button onClick={logout} className="inline-flex items-center gap-2 text-sm font-medium rounded-full border border-border px-4 py-2 hover:bg-accent">
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>
      <Tabs defaultValue="messages" className="mt-8">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="apps">Bénévoles & partenaires</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="gallery">Galerie</TabsTrigger>
          <TabsTrigger value="texts">Textes</TabsTrigger>
        </TabsList>
        <TabsContent value="messages"><Messages /></TabsContent>
        <TabsContent value="apps"><Applications /></TabsContent>
        <TabsContent value="blog"><BlogAdmin /></TabsContent>
        <TabsContent value="gallery"><GalleryAdmin /></TabsContent>
        <TabsContent value="texts"><TextsAdmin /></TabsContent>
      </Tabs>
    </section>
  );
}

function Messages() {
  const [rows, setRows] = useState<{ id: string; name: string | null; email: string; subject: string; message: string; created_at: string; handled: boolean }[]>([]);
  const load = useCallback(() => {
    supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? []));
  }, []);
  useEffect(load, [load]);
  if (!rows.length) return <Empty text="Aucun message reçu." />;
  return (
    <div className="mt-6 space-y-3">
      {rows.map((r) => (
        <div key={r.id} className={`bento p-5 ${r.handled ? "opacity-60" : ""}`}>
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <p className="font-semibold">{r.subject}</p>
              <p className="text-xs text-muted-foreground">{r.name || "Anonyme"} · <a className="underline" href={`mailto:${r.email}`}>{r.email}</a> · {fmt(r.created_at)}</p>
            </div>
            <RowActions handled={r.handled}
              onToggle={async () => { await supabase.from("contact_submissions").update({ handled: !r.handled }).eq("id", r.id); load(); }}
              onDelete={async () => { if (confirm("Supprimer ce message ?")) { await supabase.from("contact_submissions").delete().eq("id", r.id); load(); } }} />
          </div>
          <p className="mt-3 text-sm whitespace-pre-wrap">{r.message}</p>
        </div>
      ))}
    </div>
  );
}

function Applications() {
  const [rows, setRows] = useState<{ id: string; kind: string; name: string; email: string; phone: string | null; city: string | null; organization: string | null; message: string | null; created_at: string; handled: boolean }[]>([]);
  const [kind, setKind] = useState<"all" | "benevole" | "partenaire">("all");
  const load = useCallback(() => {
    supabase.from("applications").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? []));
  }, []);
  useEffect(load, [load]);
  const list = rows.filter((r) => kind === "all" || r.kind === kind);
  return (
    <div className="mt-6">
      <div className="flex gap-2">
        {(["all", "benevole", "partenaire"] as const).map((k) => (
          <button key={k} onClick={() => setKind(k)} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${kind === k ? "bg-primary text-primary-foreground" : "bg-accent"}`}>
            {k === "all" ? "Tous" : k === "benevole" ? "Bénévoles" : "Partenaires"}
          </button>
        ))}
      </div>
      {!list.length ? <Empty text="Aucune inscription." /> : (
        <div className="mt-4 space-y-3">
          {list.map((r) => (
            <div key={r.id} className={`bento p-5 ${r.handled ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-semibold">{r.name} <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[11px] text-primary">{r.kind === "benevole" ? "Bénévole" : "Partenaire"}</span></p>
                  <p className="text-xs text-muted-foreground">
                    <a className="underline" href={`mailto:${r.email}`}>{r.email}</a>{r.phone && ` · ${r.phone}`}{r.city && ` · ${r.city}`}{r.organization && ` · ${r.organization}`} · {fmt(r.created_at)}
                  </p>
                </div>
                <RowActions handled={r.handled}
                  onToggle={async () => { await supabase.from("applications").update({ handled: !r.handled }).eq("id", r.id); load(); }}
                  onDelete={async () => { if (confirm("Supprimer ?")) { await supabase.from("applications").delete().eq("id", r.id); load(); } }} />
              </div>
              {r.message && <p className="mt-3 text-sm whitespace-pre-wrap">{r.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const emptyPost = { id: "", slug: "", title: "", excerpt: "", content: "", category: CATEGORIES[0], image_url: null as string | null, author: "Green Ivory", published: false, published_at: new Date().toISOString() };
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function BlogAdmin() {
  const [posts, setPosts] = useState<DbPost[]>([]);
  const [edit, setEdit] = useState<DbPost | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => {
    supabase.from("blog_posts").select("*").order("published_at", { ascending: false }).then(({ data }) => setPosts((data ?? []) as DbPost[]));
  }, []);
  useEffect(load, [load]);

  async function save() {
    if (!edit) return;
    setBusy(true);
    const { id, ...rest } = edit;
    const payload = { ...rest, slug: rest.slug || slugify(rest.title), updated_at: new Date().toISOString() };
    const { error } = id ? await supabase.from("blog_posts").update(payload).eq("id", id) : await supabase.from("blog_posts").insert(payload);
    setBusy(false);
    if (error) return alert(error.message);
    setEdit(null); load();
  }

  if (edit)
    return (
      <div className="mt-6 bento p-6 space-y-3 max-w-3xl">
        <h2 className="text-xl font-bold">{edit.id ? "Modifier l'article" : "Nouvel article"}</h2>
        <input className={inputCls} placeholder="Titre" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
        <input className={inputCls} placeholder="Adresse (slug) — générée automatiquement si vide" value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: slugify(e.target.value) })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <select className={inputCls} value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input className={inputCls} placeholder="Auteur" value={edit.author} onChange={(e) => setEdit({ ...edit, author: e.target.value })} />
        </div>
        <textarea className={inputCls} rows={2} placeholder="Résumé" value={edit.excerpt} onChange={(e) => setEdit({ ...edit, excerpt: e.target.value })} />
        <textarea className={inputCls} rows={12} placeholder="Contenu (séparez les paragraphes par une ligne vide)" value={edit.content} onChange={(e) => setEdit({ ...edit, content: e.target.value })} />
        <div className="flex items-center gap-4">
          {edit.image_url && <img src={edit.image_url} alt="" className="h-20 w-32 object-cover rounded-xl" />}
          <input type="file" accept="image/*" onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            try { setBusy(true); const url = await uploadMedia(f); setEdit({ ...edit, image_url: url }); } catch { alert("Échec de l'envoi de l'image"); } finally { setBusy(false); }
          }} />
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.published} onChange={(e) => setEdit({ ...edit, published: e.target.checked })} /> Publié</label>
        <div className="flex gap-2">
          <button disabled={busy || !edit.title} onClick={save} className="btn-primary">Enregistrer</button>
          <button onClick={() => setEdit(null)} className="rounded-full border border-border px-5 py-2 text-sm">Annuler</button>
        </div>
      </div>
    );

  return (
    <div className="mt-6">
      <button onClick={() => setEdit({ ...emptyPost })} className="btn-primary"><Plus className="h-4 w-4" /> Nouvel article</button>
      <p className="mt-3 text-xs text-muted-foreground">Les 5 articles d'origine restent affichés sur le site ; vos nouveaux articles apparaissent en premier.</p>
      {!posts.length ? <Empty text="Aucun article créé depuis la console." /> : (
        <div className="mt-4 space-y-2">
          {posts.map((p) => (
            <div key={p.id} className="bento p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.category} · {p.published ? "Publié" : "Brouillon"} · /blog/{p.slug}</p>
              </div>
              <div className="flex gap-2">
                <IconBtn onClick={() => setEdit(p)} label="Modifier"><Pencil className="h-4 w-4" /></IconBtn>
                <IconBtn label="Supprimer" onClick={async () => { if (confirm("Supprimer cet article ?")) { await supabase.from("blog_posts").delete().eq("id", p.id); load(); } }}><Trash2 className="h-4 w-4" /></IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const GALLERY: Record<string, string[]> = {
  "Journées sans plastique": ["Journées de dépollution", "Éco-ambassadeurs", "Agents de collecte", "Recyclage", "Formation"],
  "Sentiers verts": ["Journées carrières", "Éco-entrepreneurs", "Visites de terrain"],
};

function GalleryAdmin() {
  const [photos, setPhotos] = useState<{ id: string; collection: string; tag: string; image_url: string }[]>([]);
  const [collection, setCollection] = useState(Object.keys(GALLERY)[0]);
  const [tag, setTag] = useState(GALLERY[Object.keys(GALLERY)[0]][0]);
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => {
    supabase.from("gallery_photos").select("*").order("created_at", { ascending: false }).then(({ data }) => setPhotos(data ?? []));
  }, []);
  useEffect(load, [load]);

  return (
    <div className="mt-6">
      <div className="bento p-5 flex flex-wrap items-center gap-3">
        <select className={inputCls + " max-w-xs"} value={collection} onChange={(e) => { setCollection(e.target.value); setTag(GALLERY[e.target.value][0]); }}>
          {Object.keys(GALLERY).map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className={inputCls + " max-w-xs"} value={tag} onChange={(e) => setTag(e.target.value)}>
          {GALLERY[collection].map((t) => <option key={t}>{t}</option>)}
        </select>
        <label className="btn-primary cursor-pointer">
          <Plus className="h-4 w-4" /> {busy ? "Envoi…" : "Ajouter des photos"}
          <input type="file" accept="image/*" multiple className="hidden" disabled={busy} onChange={async (e) => {
            const files = Array.from(e.target.files ?? []); if (!files.length) return;
            setBusy(true);
            try {
              for (const f of files) {
                const url = await uploadMedia(f);
                await supabase.from("gallery_photos").insert({ collection, tag, image_url: url });
              }
            } catch { alert("Échec de l'envoi"); }
            setBusy(false); e.target.value = ""; load();
          }} />
        </label>
      </div>
      {!photos.length ? <Empty text="Aucune photo ajoutée depuis la console." /> : (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((p) => (
            <div key={p.id} className="bento overflow-hidden relative group">
              <img src={p.image_url} alt={p.tag} className="aspect-square w-full object-cover" />
              <div className="p-2 text-xs">{p.collection} · {p.tag}</div>
              <button aria-label="Supprimer" onClick={async () => { if (confirm("Retirer cette photo ?")) { await supabase.from("gallery_photos").delete().eq("id", p.id); load(); } }}
                className="absolute top-2 right-2 rounded-full bg-background/90 p-2"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TextsAdmin() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<string | null>(null);
  useEffect(() => {
    supabase.from("site_content").select("key,value").then(({ data }) => setValues(Object.fromEntries((data ?? []).map((r) => [r.key, r.value]))));
  }, []);
  return (
    <div className="mt-6 space-y-4 max-w-3xl">
      <p className="text-xs text-muted-foreground">Laissez un champ vide pour revenir au texte d'origine.</p>
      {EDITABLE_TEXTS.map((t) => (
        <div key={t.key} className="bento p-5">
          <label className="text-sm font-semibold">{t.label}</label>
          <textarea className={inputCls + " mt-2"} rows={3} value={values[t.key] ?? ""} onChange={(e) => setValues({ ...values, [t.key]: e.target.value })} />
          <button className="btn-primary mt-3 !py-2" onClick={async () => {
            const { error } = await supabase.from("site_content").upsert({ key: t.key, label: t.label, value: values[t.key] ?? "", updated_at: new Date().toISOString() });
            if (error) alert(error.message); else { setSaved(t.key); setTimeout(() => setSaved(null), 2000); }
          }}>{saved === t.key ? <><Check className="h-4 w-4" /> Enregistré</> : "Enregistrer"}</button>
        </div>
      ))}
    </div>
  );
}

function RowActions({ handled, onToggle, onDelete }: { handled: boolean; onToggle: () => void; onDelete: () => void }) {
  return (
    <div className="flex gap-2">
      <IconBtn onClick={onToggle} label={handled ? "Marquer non traité" : "Marquer traité"}><Check className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={onDelete} label="Supprimer"><Trash2 className="h-4 w-4" /></IconBtn>
    </div>
  );
}
function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return <button title={label} aria-label={label} onClick={onClick} className="rounded-full border border-border p-2 hover:bg-accent">{children}</button>;
}
function Empty({ text }: { text: string }) {
  return <div className="mt-6 bento p-10 text-center text-muted-foreground">{text}</div>;
}
