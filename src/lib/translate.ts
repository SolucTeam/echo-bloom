/**
 * Traduction automatique FR → EN pour la console.
 *
 * Deux prestataires, choisis à l'appel :
 * - DeepL quand `DEEPL_API_KEY` est défini côté serveur (meilleure qualité, clé
 *   gratuite sur deepl.com, jamais exposée au navigateur) ;
 * - sinon MyMemory, service public gratuit sans clé — suffisant pour des textes
 *   courts, avec des quotas journaliers plus stricts.
 *
 * Les textes longs sont découpés aux limites naturelles (paragraphes, phrases) et
 * le HTML est traduit segment par segment, balises conservées à l'identique.
 */

/** Limite prudente par requête MyMemory (l'API accepte ≈ 500 octets par requête). */
export const MYMEMORY_MAX = 450;

/** Découpe un texte en segments de ≤ max caractères, en coupant de préférence aux phrases. */
export function chunkText(text: string, max = MYMEMORY_MAX): string[] {
  const clean = text.trim();
  if (!clean) return [];
  if (clean.length <= max) return [clean];
  const segments: string[] = [];
  for (const sentence of clean.split(/(?<=[.!?…])\s+/)) {
    if (sentence.length <= max) {
      segments.push(sentence);
      continue;
    }
    for (let i = 0; i < sentence.length; i += max) segments.push(sentence.slice(i, i + max));
  }
  const chunks: string[] = [];
  let current = '';
  for (const segment of segments) {
    if (current && current.length + 1 + segment.length <= max) current += ' ' + segment;
    else {
      if (current) chunks.push(current);
      current = segment;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

/** Segments d'un contenu HTML : chaque balise forme un segment entier, le texte le reste. */
export function splitHtmlSegments(html: string): string[] {
  return html
    .split(/(<[^>]*>)/)
    .filter((s) => s !== '');
}

export function isHtmlTag(segment: string): boolean {
  return /^<[^>]*>$/.test(segment);
}

/** Un segment mérite la traduction : du texte réel, pas une balise ni une entité isolée. */
function isTranslatable(segment: string): boolean {
  if (isHtmlTag(segment)) return false;
  // Les entités (&nbsp;, &amp;…) contiennent des lettres : on les retire avant de juger.
  return /[a-zA-ZÀ-ÿ]/.test(segment.replace(/&[#0-9a-zA-Z]+;/g, ''));
}

/**
 * Traduit le texte d'un contenu HTML en laissant les balises intactes : chaque
 * segment de texte passe dans `translate` (reçu par lots), les balises et les
 * segments sans lettres (espaces, entités) sont rendus tels quels.
 */
export async function translateHtml(html: string, translate: (texts: string[]) => Promise<string[]>): Promise<string> {
  const segments = splitHtmlSegments(html);
  const texts = segments.filter(isTranslatable);
  const translated = texts.length ? await translate(texts) : [];
  const byText = new Map(texts.map((t, i) => [t, translated[i] ?? t]));
  return segments.map((s) => (isTranslatable(s) ? byText.get(s) ?? s : s)).join('');
}

/** Exécute des tâches avec une concurrence limitée (politesse envers les services publics). */
export async function runPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

export interface TranslateOptions {
  /** Clé DeepL (serveur uniquement). Les clés gratuites se terminent par « :fx ». */
  deeplKey?: string;
  /** E-mail de contact MyMemory, augmente le quota journalier gratuit. */
  mymemoryEmail?: string;
  fetchImpl?: typeof fetch;
}

/** Traduit des textes français vers l'anglais (DeepL si clé, sinon MyMemory). */
export async function translateFrToEn(texts: string[], options: TranslateOptions = {}): Promise<string[]> {
  if (!texts.length) return [];
  if (options.deeplKey) return translateWithDeepl(texts, options.deeplKey, options.fetchImpl);
  return translateWithMyMemory(texts, options);
}

async function translateWithDeepl(texts: string[], key: string, fetchImpl?: typeof fetch): Promise<string[]> {
  const doFetch = fetchImpl ?? fetch;
  const host = key.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
  const out: string[] = [];
  for (let i = 0; i < texts.length; i += 40) {
    const batch = texts.slice(i, i + 40);
    const body = new URLSearchParams({ target_lang: 'EN', source_lang: 'FR' });
    for (const t of batch) body.append('text', t);
    const res = await doFetch(host + '/v2/translate', {
      method: 'POST',
      headers: { Authorization: 'DeepL-Auth-Key ' + key, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    if (!res.ok) throw new Error('DeepL a refusé la traduction (' + res.status + '). Vérifiez la clé DEEPL_API_KEY.');
    const json = (await res.json()) as { translations?: { text?: string }[] };
    if (!json.translations || json.translations.length !== batch.length) throw new Error('Réponse DeepL inattendue.');
    out.push(...json.translations.map((t) => t.text ?? ''));
  }
  return out;
}

/**
 * Traduction MyMemory : les paragraphes (séparés par une ligne vide) sont traduits
 * séparément puis restitués, afin que la mise en page des textes survive au voyage.
 */
async function translateWithMyMemory(texts: string[], options: TranslateOptions = {}): Promise<string[]> {
  const doFetch = options.fetchImpl ?? fetch;
  const flat: string[] = [];
  const plans = texts.map((text) => {
    const paragraphs = text
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p !== '');
    const paraChunks = paragraphs.map((p) => {
      const chunks = chunkText(p);
      const start = flat.length;
      flat.push(...chunks);
      return { start, count: chunks.length };
    });
    return { paraChunks };
  });
  const translatedFlat = await runPool(flat, 4, (chunk) => translateOne(chunk, doFetch, options.mymemoryEmail));
  return plans.map(({ paraChunks }) =>
    paraChunks.map(({ start, count }) => translatedFlat.slice(start, start + count).join(' ')).join('\n\n'),
  );
}

async function translateOne(text: string, doFetch: typeof fetch, email?: string): Promise<string> {
  const url =
    'https://api.mymemory.translated.net/get?q=' +
    encodeURIComponent(text) +
    '&langpair=fr|en' +
    (email ? '&de=' + encodeURIComponent(email) : '');
  const res = await doFetch(url);
  if (!res.ok) throw new Error('Service de traduction indisponible (' + res.status + ').');
  const json = (await res.json()) as { responseData?: { translatedText?: string; responseStatus?: number } };
  const status = json.responseData?.responseStatus;
  if (status !== undefined && status !== 200) {
    throw new Error('Quota de traduction atteint — réessayez plus tard ou ajoutez une clé DeepL gratuite.');
  }
  const translated = json.responseData?.translatedText;
  if (!translated) throw new Error('Traduction indisponible pour ce texte.');
  return translated;
}
