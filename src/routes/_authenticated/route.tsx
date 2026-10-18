import { createFileRoute, Outlet, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Session console : déconnexion automatique après 24 h sans activité sur la console.
// (Le réglage serveur équivalent est réservé au plan Supabase Pro — appliqué ici côté application.)
const INACTIVITY_LIMIT_MS = 24 * 60 * 60 * 1000;
const LAST_ACTIVE_KEY = "gi:lastActive";

function touchLastActive() {
  try { localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now())); } catch {}
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    let last = Number(localStorage.getItem(LAST_ACTIVE_KEY));
    if (!Number.isFinite(last) || last <= 0) {
      touchLastActive();
      return;
    }
    if (Date.now() - last > INACTIVITY_LIMIT_MS) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }
    touchLastActive();
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate(), router = useRouter();
  useEffect(() => {
    touchLastActive();
    let lastWrite = 0;
    const onTouch = () => {
      const now = Date.now();
      if (now - lastWrite < 60_000) return;
      lastWrite = now;
      touchLastActive();
    };
    const check = async () => {
      const stored = Number(localStorage.getItem(LAST_ACTIVE_KEY));
      if (Number.isFinite(stored) && stored > 0 && Date.now() - stored > INACTIVITY_LIMIT_MS) {
        await supabase.auth.signOut();
        router.invalidate();
        navigate({ to: "/auth" });
      }
    };
    const interval = setInterval(check, 60_000);
    window.addEventListener("pointerdown", onTouch);
    window.addEventListener("keydown", onTouch);
    return () => {
      clearInterval(interval);
      window.removeEventListener("pointerdown", onTouch);
      window.removeEventListener("keydown", onTouch);
    };
  }, [navigate, router]);
  return <Outlet />;
}
