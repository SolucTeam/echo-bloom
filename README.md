# Green Ivory

Site de Green Ivory avec pages publiques et console d’administration : pages, articles, projets, galerie, collectes de dons, partenaires, menus, coordonnées, formulaires et newsletter.

## Supabase est-il encore utilisé ?

**Oui. Supabase n’a pas été remplacé.** Le site utilise ses services pour les comptes administrateurs, la base de données et le stockage des images.

| Installation | Site | Comptes, contenus et images |
| --- | --- | --- |
| Aperçu et site Lovable actuels | Hébergement Lovable | Lovable Cloud |
| Installation autonome prévue | Votre serveur, avec Docker | Distribution Supabase auto-hébergée sur votre serveur |

L’installation autonome n’utilise **ni le projet Lovable Cloud actuel ni un projet Supabase hébergé chez Supabase**. Elle utilise toujours le logiciel Supabase, installé sur votre infrastructure. Le fichier `deployment/compose.yaml` lance le site, l’initialisation administrateur et, si demandé, le processus d’e-mails ; **il n’installe pas la distribution Supabase**. Celle-ci doit être installée séparément avant le premier démarrage.

Retirer totalement Supabase nécessiterait une autre migration des comptes, données, fichiers et accès ; cette migration n’a pas été réalisée.

## Installation locale ou sur votre serveur

Suivre **[le guide de déploiement](deployment/README.md)**. Il détaille :

1. L’installation préalable des services de données auto-hébergés.
2. L’application de `deployment/install.sql` sur une base neuve.
3. Les variables et fichiers secrets à préparer.
4. La création privée du compte administrateur avant le démarrage du site.
5. L’essai sur une machine locale, puis la configuration HTTPS sur un serveur public.
6. Le transfert des contenus et des images, les e-mails et les sauvegardes.

La configuration autonome `vite.selfhost.config.ts` est distincte de celle de l’aperçu Lovable. Docker construit le site pour Node/Nitro ; les réglages de l’aperçu ne doivent pas remplacer ceux de cette installation.

## E-mails et services externes

- **Notifications contact, bénévoles et partenaires** : réglages dans la console → E-mails automatiques ; connexion SMTP et mot de passe uniquement sur votre serveur. L’envoi reste inactif tant que le processus de mail n’est pas installé, connecté et les notifications activées. Vérifier ensuite la réception réelle.
- **Newsletter** : affichage et lien d’inscription configurables dans la console ; campagnes envoyées par le service de newsletter externe choisi.
- **Dons** : boutons vers vos pages de collecte externes ; pas de paiement traité par le site.
- **E-mails de connexion** : distincts des notifications de formulaires ; configuration propre au service d’authentification auto-hébergé si nécessaire.

Ne jamais mettre de mot de passe ou de clé privilégiée dans le dépôt, dans une variable `VITE_`, dans la console du site ou dans une sortie partagée.

## État de vérification

Les pages et la console ont été vérifiées dans l’aperçu Lovable. Les fichiers d’installation autonome sont préparés, mais **la construction Docker, le démarrage complet sur votre machine, HTTPS, le transfert, la restauration et la réception SMTP restent à vérifier sur votre infrastructure**. Le site existant n’est pas basculé automatiquement.