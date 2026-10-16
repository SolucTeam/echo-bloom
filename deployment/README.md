# Green Ivory — installation sur votre serveur

## État de cette livraison
Le site existant reste sur Lovable Cloud. Les fichiers ci-dessous préparent une **installation séparée** : aucune bascule n'est automatique. Le fonctionnement sur un serveur Linux, la construction de l'image Docker, HTTPS et la restauration doivent encore être vérifiés sur votre machine. Un serveur n'est pas fourni.

## Prérequis
Une machine Linux avec Docker Compose, Bun 1.3, et au moins les ressources recommandées par le service auto-hébergé. Pour un site public, prévoir un serveur disponible en permanence, deux noms d'hôte et un accès administrateur. Une machine locale permet un essai, mais ne rend pas le site accessible sur Internet par elle-même.

## 1. Installer les comptes, contenus et fichiers localement
Utiliser la distribution Docker officielle du service compatible avec les API existantes : [guide officiel d'auto-hébergement](https://supabase.com/docs/guides/self-hosting/docker). Elle comprend PostgreSQL, l'authentification, les API et le stockage. Tous ces services doivent être sur votre infrastructure, pas sur Lovable Cloud.

Suivre le guide pour obtenir la distribution officielle, **épingler une version**, générer les clés, définir les mots de passe et démarrer les services. Ne pas réutiliser les clés du projet Lovable. Conserver les secrets uniquement dans un fichier privé hors du dépôt, lisible par son propriétaire (`chmod 600`).

Avant démarrage, dans la configuration du service d'authentification, définir `DISABLE_SIGNUP=true` et `ENABLE_ANONYMOUS_USERS=false`. Garder les ports de PostgreSQL et les interfaces de gestion privés ; l'API publique doit être derrière HTTPS. Configurer les adresses du site et de l'API avec vos propres noms d'hôte. Ne pas exposer l'interface de gestion.

## 2. Installer le schéma
Sur une **nouvelle base vide**, appliquer le fichier `deployment/install.sql` via psql dans le conteneur PostgreSQL de la distribution. Le fichier est transactionnel et destiné à une première installation, pas à être rejoué à chaque démarrage. Conserver un suivi des fichiers déjà appliqués pour les mises à jour suivantes.

Créer ensuite, via l'interface privée du service auto-hébergé, un bucket privé nommé `media`, limité à 10 Mo par fichier, et autoriser les types d'images utilisés. Les règles de lecture et d'écriture figurent dans le schéma.

## 3. Créer l'administrateur au déploiement
Depuis une session privée sur le serveur, fournir `SUPABASE_URL` (API locale), `SUPABASE_SERVICE_ROLE_KEY` (clé de votre installation) et `ADMIN_EMAIL` au processus. Ne jamais partager ces valeurs dans une capture, un dépôt ou un terminal enregistré.

Exécuter `bun scripts/provision-admin.ts` et fournir le mot de passe sur l'entrée standard, depuis votre gestionnaire de secrets. Le mot de passe doit contenir au moins 12 caractères. `ADMIN_PASSWORD` peut aussi être fourni par votre gestionnaire de secrets, mais ne doit pas figurer dans une commande sauvegardée ou un fichier du dépôt.

- Nouveau compte : création et attribution du rôle administrateur.
- Compte existant : conservé, sans changement du mot de passe.
- Réinitialisation volontaire : même commande avec `--reset-password`.
- Un autre administrateur : même commande avec une autre adresse `ADMIN_EMAIL`.

Cette commande est privée et n'est pas un point d'accès du site. L'inscription publique est désactivée et le premier inscrit ne devient plus administrateur automatiquement.

## 4. Démarrer le site
Copier `deployment/runtime.env.example` dans un fichier privé **hors du dépôt**, compléter avec les valeurs de votre installation et relever le nom réel du réseau Docker du service. Les clés publiques sont incorporées dans le site ; la clé privilégiée est uniquement fournie au serveur à l'exécution.

Depuis le dossier du projet :

```sh
docker compose --env-file /chemin/prive/green-ivory.env -f deployment/compose.yaml up -d --build
```

La construction utilise une configuration autonome, sans l'enveloppe Vite de Lovable. Pour un essai local, utiliser une URL d'API accessible au navigateur local ; une adresse Docker interne ne fonctionne pas dans le navigateur.

Installer Caddy sur l'hôte et adapter `deployment/Caddyfile`, en fournissant `SITE_HOST` et `BACKEND_HOST`. Caddy termine HTTPS. Ne rendre publics que les ports 80 et 443 ; les ports 3000 et 8000 doivent rester locaux. Vérifier aussi les en-têtes et redirections configurés dans la distribution de l'API.

## 5. Transférer le contenu
- Dans la console source, **Exporter** produit un JSON privé contenant aussi les messages et candidatures : ne pas le publier.
- Restaurer le JSON avec la commande privée de transfert ci-dessous après création du schéma et de l'administrateur cible.
- Les images intégrées au code restent disponibles dans le site exporté. Les fichiers ajoutés à Lovable Cloud doivent être téléchargés puis transférés au stockage de votre serveur ; remplacer leurs adresses via la commande de transfert ci-dessous. Un ancien lien signé Cloud ne constitue pas une copie autonome.
- Utiliser `bun scripts/transfer-content.ts` avec `BACKUP_FILE`, `TARGET_SUPABASE_URL`, `TARGET_SERVICE_ROLE_KEY`. Le script copie les images distantes vers le bucket cible et remplace les liens avant de restaurer les contenus. Il conserve les identifiants des contenus, pas les anciens comptes.
- Vérifier les pages, couvertures d'articles, images de galerie, coordonnées et menus sur la cible. Les liens absolus vers le site d'origine sont à mettre à jour dans la console.
- Ne changer le domaine public qu'après cette vérification. Les anciens mots de passe ne sont pas exportés.

## Sauvegarde et restauration
Conserver une sauvegarde PostgreSQL via `pg_dump`, les volumes de fichiers du service de stockage et la configuration privée chiffrée. Le JSON de la console ne remplace pas une sauvegarde des fichiers et des comptes. Sauvegarder également les versions des images Docker et du code.

Pour restaurer : arrêter les écritures, restaurer PostgreSQL et les volumes de stockage dans une installation de même version, restaurer sa configuration privée, démarrer puis vérifier un téléchargement de fichier et une connexion. Tester cette procédure sur une seconde installation avant de l'utiliser en production.

## Limites à connaître
Les pages administrées utilisent des blocs prédéfinis ; les formulaires de contact, partenariat et bénévolat restent des fonctions dédiées. Ce n'est pas un système de thèmes ou d'extensions WordPress. Les comptes, base et fichiers sont auto-hébergés sur la cible ; les polices Google peuvent encore être téléchargées par le navigateur. Les e-mails de contact, paiements et newsletter ne deviennent pas opérationnels par le simple déploiement : ils nécessitent leur propre configuration.