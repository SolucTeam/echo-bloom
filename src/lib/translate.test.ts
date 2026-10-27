import { describe, it, expect } from 'vitest';
import { chunkText, splitHtmlSegments, isHtmlTag, translateHtml, runPool, translateFrToEn } from './translate';

describe('chunkText', () => {
  it('returns short texts as a single chunk', () => {
    expect(chunkText('Bonjour la planète.')).toEqual(['Bonjour la planète.']);
  });
  it('splits long texts at sentence boundaries', () => {
    const text = 'Première phrase assez courte. Deuxième phrase qui prolonge un peu le tout. Troisième et dernière phrase ici.';
    const chunks = chunkText(text, 60);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((c) => c.length <= 60)).toBe(true);
    expect(chunks.join(' ')).toBe(text);
  });
  it('hard-splits sentences longer than the limit', () => {
    const long = 'a'.repeat(1000);
    const chunks = chunkText(long, 450);
    expect(chunks.every((c) => c.length <= 450)).toBe(true);
    expect(chunks.join('')).toBe(long);
  });
  it('returns no chunk for blank input', () => {
    expect(chunkText('   ')).toEqual([]);
  });
});

describe('splitHtmlSegments / isHtmlTag', () => {
  it('separates tags from text', () => {
    expect(splitHtmlSegments('<p>Bonjour <strong>monde</strong></p>')).toEqual([
      '<p>', 'Bonjour ', '<strong>', 'monde', '</strong>', '</p>',
    ]);
    expect(isHtmlTag('<p>')).toBe(true);
    expect(isHtmlTag('Bonjour ')).toBe(false);
  });
});

describe('translateHtml', () => {
  it('translates text segments and preserves tags and entities', async () => {
    const html = '<p>Dépollution des <strong>plages</strong>&nbsp;!</p>';
    const result = await translateHtml(html, async (texts) => texts.map((t) => '[' + t + ']'));
    expect(result).toBe('<p>[Dépollution des ]<strong>[plages]</strong>&nbsp;!</p>');
  });
});

describe('runPool', () => {
  it('returns results in input order with limited concurrency', async () => {
    let active = 0, peak = 0;
    const results = await runPool([1, 2, 3, 4, 5, 6], 2, async (n) => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((r) => setTimeout(r, 5));
      active--;
      return n * 10;
    });
    expect(results).toEqual([10, 20, 30, 40, 50, 60]);
    expect(peak).toBeLessThanOrEqual(2);
  });
});

describe('translateFrToEn', () => {
  const mymemory = (translated: string, status = 200) => async (input: RequestInfo | URL) => {
    expect(String(input)).toContain('langpair=fr|en');
    return new Response(JSON.stringify({ responseData: { translatedText: translated, responseStatus: status } }), { status: 200 });
  };
  it('uses MyMemory without a key and joins paragraphs back', async () => {
    let calls = 0;
    const result = await translateFrToEn(['Bonjour.\n\nÀ demain.'], {
      fetchImpl: async () => {
        calls++;
        return new Response(JSON.stringify({ responseData: { translatedText: 'Call ' + calls, responseStatus: 200 } }), { status: 200 });
      },
    });
    expect(result).toEqual(['Call 1\n\nCall 2']);
  });
  it('throws a clear error when the MyMemory quota is exhausted', async () => {
    await expect(translateFrToEn(['Bonjour'], { fetchImpl: mymemory('quota', 403) })).rejects.toThrow(/Quota/);
  });
  it('uses DeepL batching when a key is provided', async () => {
    const seen: string[] = [];
    const result = await translateFrToEn(['Un', 'Deux'], {
      deeplKey: 'abc:fx',
      fetchImpl: async (url, init) => {
        seen.push(String(url));
        expect(String(init?.body)).toContain('target_lang=EN');
        return new Response(JSON.stringify({ translations: [{ text: 'One' }, { text: 'Two' }] }), { status: 200 });
      },
    });
    expect(seen[0]).toContain('api-free.deepl.com');
    expect(result).toEqual(['One', 'Two']);
  });
  it('routes pro keys to the pro host', async () => {
    await translateFrToEn(['Un'], {
      deeplKey: 'abc123',
      fetchImpl: async (url) => {
        expect(String(url)).toContain('api.deepl.com');
        return new Response(JSON.stringify({ translations: [{ text: 'One' }] }), { status: 200 });
      },
    });
  });
});
