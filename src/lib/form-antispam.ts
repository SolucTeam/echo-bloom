/** A fast submission must never look like a saved message. */
export function formSpamResponse(data: { website?: string; startedAt: number }, now = Date.now()): Response | null {
  if (data.website) return Response.json({ ok: true });
  if (now - data.startedAt < 2000) {
    return Response.json({ ok: false, error: 'Veuillez patienter quelques secondes puis réessayer.' }, { status: 429 });
  }
  return null;
}