import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";
import { Button } from '@/components/ui/button';

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg("Identifiants incorrects ou e-mail non confirmé.");
      navigate({ to: "/admin" });
  }

  return (
    <section className="container-x py-24 flex justify-center">
      <form onSubmit={submit} className="bento p-8 w-full max-w-md space-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Lock className="h-5 w-5" /></span>
          <h1 className="text-2xl font-bold">Connexion administrateur</h1>
        </div>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail"
          className="w-full rounded-full border border-input bg-background px-4 py-3 text-sm" />
        <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe (8 caractères min.)"
          className="w-full rounded-full border border-input bg-background px-4 py-3 text-sm" />
        <Button disabled={busy} className="w-full">{busy ? "Connexion…" : "Se connecter"}</Button>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      </form>
    </section>
  );
}
