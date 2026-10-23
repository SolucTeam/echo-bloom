import type { Partner } from '@/lib/cms-schema';
import thinkHuman from '@/assets/think-human.jpg';
import unicef from '@/assets/unicef.png';
import europeanUnion from '@/assets/european-union.jpg';
import ministereEnvironnement from '@/assets/ministere-environnement.jpg';
import uReport from '@/assets/u-report.png';
import roiBaudouin from '@/assets/roi-baudouin.jpg';
import grandBassam from '@/assets/grand-bassam.png';
import mscFoundation from '@/assets/msc-foundation.webp';
import evocaFoundation from '@/assets/evoca-foundation.png';
import concentrix from '@/assets/concentrix.png';

/** Logos présents sur le site d'origine, utilisés tant que la liste n'a pas été enregistrée depuis la console. */
export const DEFAULT_PARTNERS: Partner[] = [
  { name: 'Think Human Foundation', image: thinkHuman },
  { name: 'UNICEF', image: unicef },
  { name: 'Union européenne', image: europeanUnion },
  { name: "Ministère de l'Environnement et de la Transition Écologique", image: ministereEnvironnement },
  { name: "U-Report Côte d'Ivoire", image: uReport },
  { name: 'Fondation Roi Baudouin', image: roiBaudouin },
  { name: 'Ville de Grand-Bassam', image: grandBassam },
  { name: 'MSC Foundation', image: mscFoundation },
  // Partenaires ajoutés d'après la brochure Green Ivory 2026
  { name: 'EVOCA Foundation', image: evocaFoundation },
  { name: 'Concentrix', image: concentrix },
];
