import type { Partner } from '@/lib/cms-schema';
import thinkHuman from '@/assets/think-human.jpg';
import unicef from '@/assets/unicef.png';
import europeanUnion from '@/assets/european-union.jpg';

/** Logos présents sur le site d'origine, utilisés tant que la liste n'a pas été enregistrée depuis la console. */
export const DEFAULT_PARTNERS: Partner[] = [
  { name: 'Think Human Foundation', image: thinkHuman.url },
  { name: 'UNICEF', image: unicef.url },
  { name: 'Union européenne', image: europeanUnion.url },
];
