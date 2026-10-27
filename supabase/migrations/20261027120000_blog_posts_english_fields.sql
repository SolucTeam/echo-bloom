-- Version anglaise optionnelle des articles (phase 2 bilingue).
-- Colonnes nullables : les articles existants restent inchangés (repli français champ par champ).
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
  ADD COLUMN IF NOT EXISTS content_en TEXT;
