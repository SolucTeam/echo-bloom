/**
 * Dictionnaire bilingue de l’interface (chrome du site) : chaque clé → [français, english].
 * Phase 1 : seuls les textes « système » codés en dur sont traduits ici ; les contenus
 * éditables en console (programmes, articles, textes d’accueil…) restent en français
 * jusqu’à la phase 2 (champs anglais optionnels avec repli français champ par champ).
 */
export type Lang = 'fr' | 'en';

type Entry = readonly [fr: string, en: string];

export const DICT = {
  /* En-tête / navigation */
  'nav.home': ['Accueil', 'Home'],
  'nav.about': ['À propos', 'About us'],
  'nav.programs': ['Programmes', 'Programs'],
  'nav.news': ['Actualités', 'News'],
  'nav.contact': ['Contact', 'Contact'],
  'nav.partner': ['Devenir partenaire', 'Become a partner'],
  'nav.volunteer': ['Devenir bénévole', 'Become a volunteer'],
  'nav.donate': ['Faire un don', 'Donate'],
  'header.openMenu': ['Ouvrir le menu', 'Open menu'],
  'header.closeMenu': ['Fermer le menu', 'Close menu'],

  /* Pied de page */
  'footer.links': ['Liens utiles', 'Useful links'],
  'footer.contactUs': ['Nous contacter', 'Contact us'],
  'footer.rights': ['Tous droits réservés.', 'All rights reserved.'],
  'footer.madeWith': ['Conçu avec ❤️ pour la planète.', 'Made with ❤️ for the planet.'],
  'footer.admin': ['Console d’administration', 'Admin console'],

  /* Accueil (chrome uniquement ; les textes de sections restent en console) */
  'home.ctaSupport': ['Soutenir nos programmes', 'Support our programs'],
  'home.ctaDiscover': ['Découvrir nos programmes', 'Discover our programs'],
  'home.allPrograms': ['Tous nos programmes', 'All our programs'],
  'common.learnMore': ['En savoir plus', 'Learn more'],

  /* Programmes — listing */
  'programs.eyebrow': ['Sur le terrain', 'On the ground'],
  'programs.title': ['Nos programmes', 'Our programs'],
  'programs.intro': [
    'Des initiatives concrètes pour protéger l’environnement et accompagner la jeunesse en Côte d’Ivoire.',
    'Concrete initiatives to protect the environment and support young people in Côte d’Ivoire.',
  ],
  'programs.countOne': ['1 programme actif sur le terrain', '1 active program on the ground'],
  'programs.countMany': ['{n} programmes actifs sur le terrain', '{n} active programs on the ground'],
  'programs.empty': ['Nos prochains programmes seront présentés ici.', 'Our upcoming programs will be presented here.'],
  'programs.ctaTitle': ['Vous voulez soutenir une initiative ?', 'Want to support an initiative?'],
  'programs.ctaIntro': [
    'Rejoignez les équipes de terrain, devenez partenaire ou soutenez financièrement nos programmes.',
    'Join our field teams, become a partner or support our programs financially.',
  ],
  'programs.discover': ['Découvrir ce programme', 'Discover this program'],

  /* Programmes — page détail */
  'program.back': ['Tous les programmes', 'All programs'],
  'program.sponsor': ['Devenir un sponsor', 'Become a sponsor'],
  'meta.org': ['Organisation', 'Organization'],
  'meta.launch': ['Lancement', 'Launched'],
  'meta.pilot': ['Phase pilote', 'Pilot phase'],
  'meta.firstEdition': ['1ʳᵉ édition', '1st edition'],
  'program.goal': ['Objectif', 'Goal'],
  'program.context': ['Contexte', 'Context'],
  'program.why': ['Pourquoi ce programme ?', 'Why this program?'],
  'program.objectives': ['Objectifs spécifiques', 'Specific objectives'],
  'program.outcomes': ['Résultats attendus', 'Expected outcomes'],
  'program.support': ['Soutenir ce programme', 'Support this program'],
  'program.others': ['Explorer nos autres programmes', 'Explore our other programs'],
  'program.seeAll': ['Voir tous les programmes', 'See all programs'],
  'program.actTitle': ['Agir avec nous', 'Act with us'],
  'program.actIntro': [
    'Chaque geste compte : rejoignez les équipes de terrain ou soutenez {title} financièrement.',
    'Every gesture counts: join the field teams or support {title} financially.',
  ],

  /* Actualités */
  'news.eyebrow': ['Actualités', 'News'],
  'news.title': ['Toute notre actualité.', 'All our latest news.'],
  'news.intro': [
    'Articles, photos, communiqués de presse et événements : suivez la vie de Green Ivory et passez à l’action avec nous.',
    'Articles, photos, press releases and events: follow what Green Ivory is up to and take action with us.',
  ],
  'tab.articles': ['Articles', 'Articles'],
  'tab.photos': ['Photos', 'Photos'],
  'tab.press': ['Presse', 'Press'],
  'tab.events': ['Événements', 'Events'],
  'news.sectionsAria': ['Sections des actualités', 'News sections'],
  'news.searchPlaceholder': ['Rechercher un article…', 'Search for an article…'],
  'news.searchAria': ['Rechercher un article', 'Search for an article'],
  'news.noResults': ['Aucun article ne correspond à votre recherche.', 'No article matches your search.'],
  'news.featured': ['À la une', 'Featured'],
  'news.readArticle': ['Lire l’article', 'Read the article'],
  'common.all': ['Tous', 'All'],

  /* Galerie et aperçu plein écran */
  'gallery.empty': ['Aucune photo pour le moment — revenez bientôt.', 'No photos yet — check back soon.'],
  'gallery.photo': ['photo', 'photo'],
  'gallery.enlarge': ['Agrandir la photo : {img}', 'Enlarge photo: {img}'],
  'lightbox.openAria': ['Aperçu de la photo en plein écran', 'Full-screen photo preview'],
  'lightbox.close': ['Fermer l’aperçu', 'Close preview'],
  'lightbox.prev': ['Photo précédente', 'Previous photo'],
  'lightbox.next': ['Photo suivante', 'Next photo'],

  /* Page article */
  'blog.notFoundTitle': ['Article introuvable', 'Article not found'],
  'blog.notFoundText': ['Cet article n’existe pas ou a été déplacé.', 'This article does not exist or has been moved.'],
  'blog.errorTitle': ['Une erreur est survenue', 'Something went wrong'],
  'blog.backNews': ['Retour aux actualités', 'Back to news'],
  'blog.allNews': ['Toutes les actualités', 'All news'],
  'blog.readTime': ['de lecture', 'read'],
  'blog.supportProgram': ['Soutenir un programme', 'Support a program'],
  'blog.actTitle': ['Agissez avec nous', 'Act with us'],
  'blog.actText': [
    'Soutenez Green Ivory en rejoignant nos équipes de bénévoles ou en devenant partenaire.',
    'Support Green Ivory by joining our volunteer teams or becoming a partner.',
  ],
  'blog.volunteer': ['Bénévole', 'Volunteer'],
  'blog.partner': ['Partenaire', 'Partner'],
  'blog.alsoRead': ['À lire aussi', 'Also read'],
  'blog.breadcrumbAria': ['Fil d’Ariane', 'Breadcrumb'],

  /* Presse */
  'press.eyebrow': ['Espace presse', 'Press room'],
  'press.kitTitle': ['Kit média', 'Media kit'],
  'press.kitIntro': [
    'Tout ce qu’il faut pour illustrer un article, une interview ou un reportage sur Green Ivory.',
    'Everything you need to illustrate an article, an interview or a feature about Green Ivory.',
  ],
  'press.kitBrand': ['Kit de marque', 'Brand kit'],
  'press.kitBrandText': [
    'Logo officiel, charte graphique et éléments de présentation de l’organisation, prêts à l’emploi.',
    'Official logo, brand guidelines and presentation materials, ready to use.',
  ],
  'press.kitBrandCta': ['Demander le kit', 'Request the kit'],
  'press.kitPhotos': ['Banque de photos', 'Photo library'],
  'press.kitPhotosText': [
    'Photos de terrain, formations et événements, libres de droits pour une couverture médiatique avec mention de la source.',
    'Field, training and event photos, royalty-free for media coverage with source credit.',
  ],
  'press.kitPhotosCta': ['Parcourir la galerie', 'Browse the gallery'],
  'press.kitInterviews': ['Interviews & interventions', 'Interviews & talks'],
  'press.kitInterviewsText': [
    'Notre porte-parole est disponible pour les plateaux, podcasts et conférences sur la pollution plastique, la biodiversité et le climat.',
    'Our spokesperson is available for shows, podcasts and conferences on plastic pollution, biodiversity and climate.',
  ],
  'press.kitInterviewsCta': ['Proposer une interview', 'Propose an interview'],
  'press.releasesEyebrow': ['Communiqués', 'Press releases'],
  'press.releasesTitle': ['Derniers communiqués', 'Latest releases'],
  'press.countOne': ['1 communiqué', '1 press release'],
  'press.countMany': ['{n} communiqués', '{n} press releases'],
  'press.emptyTitle': ['Aucun communiqué pour le moment', 'No press releases yet'],
  'press.emptyText': [
    'Nos prochaines annonces paraîtront ici. Pour toute demande, contactez le service presse.',
    'Our next announcements will be published here. For any request, contact the press office.',
  ],
  'press.downloadRelease': ['Télécharger le communiqué', 'Download the release'],
  'press.download': ['Télécharger', 'Download'],
  'press.contactTitle': ['Contact presse', 'Press contact'],
  'press.contactText': [
    'Une question, une demande d’interview ou d’accréditation ? Nous répondons rapidement.',
    'A question, an interview or accreditation request? We reply quickly.',
  ],
  'press.contactCta': ['Écrire au service presse', 'Write to the press office'],

  /* Événements */
  'events.next': ['Prochain rendez-vous', 'Next event'],
  'events.emptyTitle': ['Aucun événement prévu pour le moment', 'No events scheduled at the moment'],
  'events.emptyText': [
    'Nos prochaines dates seront annoncées ici — suivez nos actualités pour ne rien manquer.',
    'Our next dates will be announced here — follow our news so you don’t miss anything.',
  ],
  'events.pastEyebrow': ['Rétrospective', 'Retrospective'],
  'events.pastTitle': ['Éditions passées', 'Past editions'],
  'events.ctaTitle': ['Envie de participer au prochain événement ?', 'Want to take part in our next event?'],
  'events.ctaText': [
    'Rejoignez nos équipes de bénévoles sur le terrain — chaque geste compte.',
    'Join our volunteer teams in the field — every gesture counts.',
  ],

  /* Pages d'état : 404, erreur, maintenance */
  'notfound.title': ['Cette page n’a pas poussé ici', 'This page didn’t grow here'],
  'notfound.text': [
    'Elle a peut-être été déplacée, renommée, ou c’est simplement une graine qui n’a pas encore germé.',
    'It may have been moved or renamed, or it is simply a seed that has not sprouted yet.',
  ],
  'notfound.backHome': ['Retour à l’accueil', 'Back to home'],
  'error.title': ['Cette page n’a pas pu se charger', 'This page could not load'],
  'error.text': [
    'Une erreur est survenue de notre côté. Réessayez — le reste du site reste accessible.',
    'Something went wrong on our side. Try again — the rest of the site remains accessible.',
  ],
  'error.retry': ['Réessayer', 'Try again'],
  'maint.title': ['Petite pause jardinage', 'A short gardening break'],
  'maint.text': [
    'Le site est en entretien — on arrose, on désherbe et on plante. Tout repoussera plus vert d’ici quelques instants.',
    'The site is under maintenance — watering, weeding and planting. Everything will grow back greener in a few moments.',
  ],
  'maint.thanks': ['Merci de votre patience', 'Thank you for your patience'],
  'maint.reload': ['Recharger la page', 'Reload the page'],

  /* Page de remerciement après envoi de formulaire */
  'merci.title': ['Merci pour votre message !', 'Thank you for your message!'],
  'merci.readArticles': ['Découvrir nos articles', 'Read our articles'],

  /* Formulaires — libellés et messages codés en dur ; les textes configurables (titre, intro,
   * bouton, missions…) restent fournis par la console et ne sont pas traduits en phase 1. */
  'form.sending': ['Envoi en cours…', 'Sending…'],
  'form.fullName': ['Nom complet', 'Full name'],
  'form.email': ['E-mail', 'Email'],
  'form.phone': ['Téléphone', 'Phone'],
  'form.city': ['Ville', 'City'],
  'form.lastName': ['Nom', 'Last name'],
  'form.firstName': ['Prénoms', 'First names'],
  'form.residenceCountry': ['Pays de résidence', 'Country of residence'],
  'form.organization': ['Organisation', 'Organization'],
  'form.yourMessage': ['Votre message', 'Your message'],
  'form.sendRequest': ['Envoyer ma demande', 'Send my request'],

  /* Contact */
  'contact.addressLabel': ['Notre adresse', 'Our address'],
  'contact.phoneLabel': ['Nos contacts', 'Our phone'],
  'contact.emailsLabel': ['Nos emails', 'Our emails'],
  'contact.volunteerText': [
    'Envie d’agir pour l’environnement ? Rejoignez Green Ivory et participez activement à nos actions : nettoyages, sensibilisation, reboisement, événements éco-responsables.',
    'Want to act for the environment? Join Green Ivory and take an active part in our actions: clean-ups, awareness-raising, tree planting, eco-responsible events.',
  ],
  'contact.nameLabel': ['Votre nom (facultatif)', 'Your name (optional)'],
  'contact.subjectLabel': ['Objet', 'Subject'],
  'contact.privacy': [
    'En soumettant ce formulaire, vous acceptez que vos informations soient utilisées pour traiter votre demande. Aucune donnée n’est transmise à des tiers.',
    'By submitting this form, you agree that your information may be used to process your request. No data is shared with third parties.',
  ],
  'contact.errorGeneric': ['Une erreur est survenue. Réessayez.', 'Something went wrong. Please try again.'],
  'contact.errorNetwork': ['Réseau indisponible. Réessayez.', 'Network unavailable. Please try again.'],

  /* Bénévolat */
  'volunteer.missionsTitle': ['Vos missions possibles', 'Ways you can help'],
  'volunteer.checkFields': ['Vérifiez les champs.', 'Please check the fields.'],
  'volunteer.sendFailed': ['Envoi impossible.', 'Unable to send.'],

  /* Partenariat */
  'partner.eyebrow': ['Agir avec Green Ivory', 'Act with Green Ivory'],
  'partner.intro': [
    'Entreprises, institutions, ONG, collectivités : rejoignez Green Ivory pour développer des solutions durables face aux défis environnementaux.',
    'Businesses, institutions, NGOs, local authorities: join Green Ivory to develop sustainable solutions to environmental challenges.',
  ],
  'partner.logosTitle': ['Ils soutiennent nos actions', 'They support our actions'],
  'partner.collectionsTitle': ['Vous souhaitez soutenir une collecte ?', 'Would you like to support a collection?'],
  'partner.collectionsText': [
    'Faire un don est simple : choisissez la collecte qui vous tient à cœur et contribuez en quelques clics.',
    'Donating is simple: choose the collection close to your heart and contribute in a few clicks.',
  ],
  'partner.whyTitle': ['Pourquoi nous rejoindre ?', 'Why join us?'],
  'partner.why1': ['Donner un impact mesurable à votre engagement RSE.', 'Give measurable impact to your CSR commitment.'],
  'partner.why2': ['Soutenir l’éducation environnementale de la jeunesse ivoirienne.', 'Support environmental education for Ivorian youth.'],
  'partner.why3': ['Co-construire des projets terrain (dépollution, reboisement, formation).', 'Co-build field projects (clean-ups, tree planting, training).'],
  'partner.why4': ['Bénéficier d’une visibilité auprès d’une communauté engagée.', 'Gain visibility with a committed community.'],
  'partner.formTitle': ['Formulaire de partenariat', 'Partnership form'],
  'partner.sendFailed': ['Envoi impossible, réessayez.', 'Unable to send, please try again.'],
  'partner.sentThanks': ['Merci, nous vous recontactons rapidement.', 'Thank you, we will get back to you shortly.'],

  /* Don */
  'donate.intro': [
    'Soutenez les actions de Green Ivory en contribuant à une collecte. Ensemble, protégeons notre environnement.',
    'Support Green Ivory’s actions by contributing to a collection. Together, let’s protect our environment.',
  ],
  'donate.gestureImpact': ['Un geste, un impact', 'One gesture, one impact'],
  'donate.pickTitle': ['Soutenez une collecte qui vous tient à cœur.', 'Support a collection close to your heart.'],
  'donate.pickIntro': [
    'Dépollution des plages, reboisement, éducation environnementale : chaque contribution finance directement une action de terrain.',
    'Beach clean-ups, tree planting, environmental education: every contribution directly funds an action on the ground.',
  ],
  'donate.impactCleanup': ['Dépollution des plages', 'Beach clean-ups'],
  'donate.impactTrees': ['Reboisement', 'Tree planting'],
  'donate.impactEducation': ['Éducation environnementale', 'Environmental education'],
  'donate.statsEyebrow': ['Notre impact en chiffres', 'Our impact in numbers'],
  'donate.treeEyebrow': ['Votre impact', 'Your impact'],
  'donate.treeTitle': ['Chaque don fait grandir une forêt.', 'Every donation grows a forest.'],
  'donate.treeText': [
    'Choisissez un palier et regardez votre contribution prendre vie : ce visuel célèbre la croissance de nos actions de reboisement, rendue possible par votre générosité.',
    'Choose a tier and watch your contribution come to life: this visual celebrates the growth of our tree-planting actions, made possible by your generosity.',
  ],
  'donate.tierAria': ['Palier de don', 'Donation tier'],
  'donate.selectedTier': ['Palier sélectionné :', 'Selected tier:'],
  'donate.selectedTierTail': [
    '— concrétisez-le via l’une des collectes ci-dessous.',
    '— make it happen through one of the collections below.',
  ],
  'donate.collection': ['Collecte {n}', 'Collection {n}'],
  'donate.contributeAria': ['Contribuer à {label} (nouvel onglet)', 'Contribute to {label} (new tab)'],
  'donate.contribute': ['Contribuer à cette collecte', 'Contribute to this collection'],
  'donate.companyTitle': ['Vous représentez une entreprise ou une institution ?', 'Do you represent a company or an institution?'],
  'donate.companyText': [
    'Devenez partenaire de Green Ivory et co-construisez des projets terrain avec nos équipes.',
    'Become a Green Ivory partner and co-build field projects with our teams.',
  ],

  /* Repli anglais de l'interface restée en français (audits bilinguisme). */
  'home.hero.titleFallback': ['Engageons-nous pour un avenir durable.', 'Committing to a sustainable future.'],
  'home.about.imgForest': ['Forêt ivoirienne', 'Ivorian forest'],
  'home.about.imgYouth': ['Remise du chèque Unicef au projet Circulnature', 'Unicef cheque handover to the Circulnature project'],
  'about.founder.alt': ['Khérann YAO, Président', 'Khérann YAO, President'],
  'about.badge.recognized': ['Reconnue', 'Recognized'],
  'about.badge.ambassador': ['Jeune Ambassadeur\nUNICEF Environnement', 'Young Ambassador\nUNICEF Environment'],
  'about.plastic.alt': ['Sensibilisation en classe sur la pollution plastique', 'Classroom session on plastic pollution'],
  'about.history.text2Strong': [
    'L’ONG est dirigée par {name}, Jeune Ambassadeur de l’UNICEF pour l’Environnement (2018), entouré d’une équipe pluridisciplinaire et de bénévoles dévoués.',
    'The NGO is led by {name}, UNICEF Young Ambassador for the Environment (2018), supported by a multidisciplinary team and dedicated volunteers.',
  ],
  'press.kitBrandSubject': ['Demande de kit de marque', 'Brand kit request'],
  'press.kitInterviewSubject': ['Demande d’interview', 'Interview request'],
  'maint.tagline': ['Le pouvoir citoyen pour l’environnement', 'Citizen power for the environment'],
  'partner.logosAria': ['Partenaires Green Ivory', 'Green Ivory partners'],
  'footer.tagline': [
    'Le pouvoir citoyen pour l’environnement. ONG ivoirienne engagée contre la pollution plastique, pour la biodiversité et le climat depuis 2017.',
    'Citizen power for the environment. Ivorian NGO committed against plastic pollution, for biodiversity and the climate since 2017.',
  ],
  'form.honeypot': ['Ne remplissez pas ce champ', 'Do not fill in this field'],
  'form.message': ['Message', 'Message'],
} as const satisfies Record<string, Entry>;

export type DictKey = keyof typeof DICT;

/** Traduit une clé dans la langue donnée, avec substitution optionnelle de paramètres {n}, {title}… */
export function tr(lang: Lang, key: DictKey, params?: Record<string, string | number>): string {
  let text: string = DICT[key][lang === 'en' ? 1 : 0];
  if (params) {
    for (const [k, v] of Object.entries(params)) text = text.replaceAll(`{${k}}`, String(v));
  }
  return text;
}

/** Texte anglais du dictionnaire pour une clé (phase 3 : méta émises côté head). */
export function enText(key: DictKey): string {
  return DICT[key][1];
}

/** Libellés de menu standards traduits en anglais ; les libellés personnalisés de la console restent tels quels. */
const MENU_EN: Record<string, string> = {
  'Accueil': 'Home',
  'À propos': 'About us',
  'Programmes': 'Programs',
  'Actualités': 'News',
  'Contact': 'Contact',
  'Devenir partenaire': 'Become a partner',
  'Devenir bénévole': 'Become a volunteer',
  'Faire un don': 'Donate',
};

/** Traduit une étiquette de menu connue ; les libellés personnalisés (console) restent inchangés. */
export function trLabel(lang: Lang, label: string): string {
  return lang === 'en' ? MENU_EN[label] ?? label : label;
}

/**
 * Messages de validation du schéma partagé (form-settings.ts) traduits au moment de
 * l’affichage côté client. Le schéma et le serveur restent en français : seuls les
 * messages listés ici ont une version anglaise, les autres s’affichent tels quels.
 */
const VALIDATION_EN: Record<string, string> = {
  'E-mail invalide.': 'Invalid email address.',
  'Objet trop court.': 'Subject is too short.',
  'Message trop court (10 caractères minimum).': 'Message is too short (10 characters minimum).',
  'Le nom est requis.': 'Name is required.',
};

export function trMsg(lang: Lang, msg: string): string {
  return lang === 'en' ? VALIDATION_EN[msg] ?? msg : msg;
}
