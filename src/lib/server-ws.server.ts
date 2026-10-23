// Node < 22 n'expose pas de WebSocket natif, pourtant le client temps réel de
// Supabase l'exige dès la création du client. Fournit « ws » comme solution de
// repli globale. Fichier .server : jamais bundled côté navigateur.
import WebSocket from 'ws';

/** Idempotent : sans effet sous Node 22+, bun, ou tout runtime avec WebSocket natif. */
export function ensureNodeWebSocket(): void {
  if (typeof globalThis.WebSocket === 'undefined') {
    (globalThis as { WebSocket?: unknown }).WebSocket = WebSocket;
  }
}
