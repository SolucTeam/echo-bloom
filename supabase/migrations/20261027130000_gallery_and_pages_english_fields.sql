-- Version anglaise optionnelle (phase 2/3 bilingue).
-- Colonnes nullables : les données existantes restent inchangées (repli français champ par champ).
ALTER TABLE public.gallery_photos
  ADD COLUMN IF NOT EXISTS tag_en TEXT;

ALTER TABLE public.cms_pages
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT;
