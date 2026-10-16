# Green Ivory : gestion complète et hébergement autonome

## Résultat prévu
Une console permettant de gérer l'ensemble du site sans modifier son code, avec une installation sur votre propre serveur et un compte administrateur créé lors du premier déploiement.

Vous n'avez pas encore de serveur. L'installation sera préparée pour une machine Linux avec Docker, utilisable d'abord en local, puis sur un serveur loué. L'hébergement et le nom de domaine éventuel restent à votre charge ; rien ne sera déployé sur une machine externe sans accès et autorisation.

## 1. Gestion de tout le site
- **Pages** : modifier les textes, images, liens et sections des pages existantes ; réordonner et masquer les sections ; créer des pages à partir de blocs prédéfinis, avec brouillon et publication.
- **Blog** : gérer aussi les articles d'origine, les catégories, les images et la publication, avec un éditeur de contenu enrichi.
- **Médias et galerie** : bibliothèque commune, collections, légendes et textes alternatifs ; remplacer ou retirer les images existantes.
- **Navigation et paramètres** : menus, pied de page, logo, coordonnées, réseaux sociaux et liens des boutons.
- **Référencement** : titre, description et image de partage pour chaque page et article ; sitemap alimenté par les contenus publiés.
- **Messages et candidatures** : conserver leur consultation et leur traitement dans la console.

Cette console sera inspirée de WordPress, mais ne sera pas WordPress : pas de compatibilité avec ses extensions ou ses thèmes.

## 2. Accès administrateurs
- Retirer l'inscription publique et l'attribution automatique des droits au premier inscrit.
- Créer le premier administrateur par une commande privée au déploiement, jamais depuis une page publique.
- Ne pas recréer ni réinitialiser ce compte à chaque redémarrage.
- Vérifier les droits côté serveur pour chaque opération protégée ; ne pas se fier aux contrôles de l'écran.
- Fournir une procédure privée pour créer un autre administrateur et réinitialiser un accès.
- Ne jamais inclure de mot de passe ou de clé privée dans le code livré.

## 3. Installation autonome
- Préparer le site, les comptes, la base de données et les fichiers pour fonctionner sur la même infrastructure, indépendamment de Lovable Cloud.
- Fournir les instructions d'installation, de configuration du domaine et de HTTPS, de sauvegarde et de restauration.
- Préparer le transfert des contenus et médias existants, avec vérification des liens. Les anciens mots de passe ne seront pas récupérés : les accès seront recréés de manière sécurisée.
- Garder le site actuel disponible pendant la préparation ; la bascule n'aura lieu qu'après vérification de l'installation autonome.

## Détails techniques
- Conserver React et TanStack Start ; prévoir une configuration de déploiement autonome distincte de celle de l'aperçu Lovable.
- Utiliser PostgreSQL et un service d'authentification et de stockage auto-hébergés compatibles avec les accès existants, afin de limiter les changements risqués.
- Centraliser les contenus des pages, paramètres, menus et médias ; remplacer progressivement les contenus fixes par les contenus administrables.
- Ne pas tenter de déconnecter ce projet de Lovable Cloud : préparer une installation exportable séparée. L'aperçu actuel ne prouve pas que l'installation sur votre futur serveur fonctionne.

## Vérification et limites
- Tester connexion, refus d'accès, création au déploiement, modification d'une page, publication d'un article et remplacement d'une image, puis vérifier le résultat public.
- Vérifier que les brouillons et messages privés ne sont pas accessibles publiquement.
- Tester l'installation et la persistance après redémarrage lorsque l'environnement autonome sera disponible ; signaler explicitement ce qui reste non vérifié.
- L'envoi des messages par e-mail nécessite encore une adresse destinataire et un service d'envoi : il ne sera pas présenté comme opérationnel tant qu'ils ne sont pas configurés.