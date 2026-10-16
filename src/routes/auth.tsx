import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion administrateur — Green Ivory" },
      { name: "description", content: "Accès réservé à l'administration du site Green Ivory." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Connexion — Green Ivory" },
      { property: "og:description", content: "Accès administrateur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg("Identifiants incorrects ou e-mail non confirmé.");
      navigate({ to: "/admin" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      setBusy(false);
      if (error) return setMsg(error.message);
      if (data.session) navigate({ to: "/admin" });
      else setMsg("Compte créé. Confirmez votre adresse via l'e-mail reçu, puis connectez-vous.");
    }
  }

  return (
    <section className="container-x py-24 flex justify-center">
      <form onSubmit={submit} className="bento p-8 w-full max-w-md space-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Lock className="h-5 w-5" /></span>
          <h1 className="text-2xl font-bold">{mode === "in" ? "Connexion admin" : "Créer le compte admin"}</h1>
        </div>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail"
          className="w-full rounded-full border border-input bg-background px-4 py-3 text-sm" />
        <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe (8 caractères min.)"
          className="w-full rounded-full border border-input bg-background px-4 py-3 text-sm" />
        <button disabled={busy} className="btn-primary w-full justify-center">{busy ? "…" : mode === "in" ? "Se connecter" : "Créer le compte"}</button>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="text-xs text-primary underline">
          {mode === "in" ? "Première utilisation ? Créer le compte" : "J'ai déjà un compte"}
        </button>
      </form>
    </section>
  );
}
