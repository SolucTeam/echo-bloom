import { describe, it, expect } from 'vitest';
import { localizedBlogPost, type BlogPost } from './blog-posts';

const base: BlogPost = {
  slug: 'test-article', title: 'Article français', excerpt: 'Résumé français',
  date: '2026-01-15', dateLabel: '15 janvier 2026', author: 'Green Ivory',
  category: 'Environnement' as BlogPost['category'], image: '', readingTime: '2 min',
  content: ['Premier paragraphe.', 'Deuxième paragraphe.'],
};

describe('localized blog post (phase 2 bilingue)',()=>{
  it('returns the article unchanged in French',()=>expect(localizedBlogPost(base,'fr')).toBe(base));
  it('replaces title and excerpt with their English counterparts when filled',()=>{
    const view=localizedBlogPost({...base,titleEn:'English article',excerptEn:'  '},'en');
    expect(view.title).toBe('English article');
    expect(view.excerpt).toBe('Résumé français'); // Résumé EN vide : repli français.
  });
  it('uses the English paragraphs for text articles and recomputes reading time',()=>{
    const long=Array(500).fill('word').join(' ');
    const view=localizedBlogPost({...base,contentEn:['First paragraph.',long]},'en');
    expect(view.content).toEqual(['First paragraph.',long]);
    expect(view.readingTime).not.toBe(base.readingTime);
  });
  it('falls back to French paragraphs when the English ones are all blank',()=>{
    const view=localizedBlogPost({...base,contentEn:['  ','']},'en');
    expect(view.content).toEqual(base.content);
    expect(view.readingTime).toBe(base.readingTime);
  });
  it('swaps the rendered HTML for its English version on HTML articles',()=>{
    const htmlPost={...base,content:[],html:'<p>Contenu français</p>',htmlEn:'<p>English content</p>'} as BlogPost & {html:string|null;htmlEn:string|null};
    expect(localizedBlogPost(htmlPost,'en').html).toBe('<p>English content</p>');
    // Pas de contenu EN : repli sur le HTML français.
    expect(localizedBlogPost({...htmlPost,htmlEn:null},'en').html).toBe('<p>Contenu français</p>');
  });
  it('formats the displayed date in English',()=>{
    expect(localizedBlogPost(base,'en').dateLabel).toBe('15 January 2026');
  });
});
