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
Le premier lancement Docker exécute automatiquement le service privé `admin-init` **avant de démarrer le site**. Ce service vérifie auprès du service d'authentification que l'inscription publique est désactivée, crée le compte confirmé et lui attribue le rôle administrateur. Une erreur de configuration, une API indisponible ou un échec d'attribution des droits bloque le premier lancement du site. Aucun formulaire de création de compte ni point d'accès de provisionnement n'est exposé.

Après installation du schéma et démarrage des services de données :

1. Copier `deployment/runtime.env.example` dans `/etc/green-ivory/server.env`, **hors du dépôt**.
2. Créer `/etc/green-ivory/admin-password` avec votre gestionnaire de secrets. Ce fichier contient uniquement le mot de passe choisi, au moins 12 caractères. Ne pas écrire le mot de passe dans une commande, une capture ou le fichier de configuration.
3. Protéger les deux fichiers et leur dossier : dossier `700`, fichiers `600`, propriétaire = compte de déploiement. Le mot de passe doit être lisible par l'utilisateur `bun` du service d'initialisation via le montage Docker ; adapter le propriétaire au compte du conteneur ou les ACL privées si nécessaire, sans rendre le fichier lisible par tous.
4. Renseigner les variables ci-dessous puis lancer la commande de la section 4.

### Configuration du serveur

| Variable dans `server.env` | Valeur à renseigner | Confidentialité |
| --- | --- | --- |
| `SITE_URL` | Adresse publique du site, en HTTPS, sans slash final | Publique |
| `PUBLIC_BACKEND_URL` | Adresse HTTPS de votre service de données accessible aux navigateurs, sans slash final | Publique |
| `INTERNAL_BACKEND_URL` | Adresse du même service accessible depuis les conteneurs, par exemple `http://kong:8000` si ce nom existe dans votre réseau | Interne |
| `BACKEND_NETWORK` | Nom réel du réseau Docker de votre service de données | Interne |
| `ANON_KEY` | Clé publique provenant de **votre propre installation** | Publique |
| `SERVICE_ROLE_KEY` | Clé privilégiée provenant de **votre propre installation**, jamais une clé du projet Lovable | Secrète, serveur uniquement |
| `ADMIN_EMAIL` | Adresse e-mail du compte administrateur à créer | Privée |
| `ADMIN_PASSWORD_FILE` | Chemin absolu du fichier privé sur l'hôte, par exemple `/etc/green-ivory/admin-password` | Chemin privé ; ne pas y mettre le mot de passe |

Dans la configuration **du service d'authentification**, pas dans `server.env`, renseigner `DISABLE_SIGNUP=true` et `ENABLE_ANONYMOUS_USERS=false`, puis redémarrer ce service. Ces variables doivent être transmises effectivement à sa configuration d'exécution ; les placer uniquement dans celle du site ne désactive pas l'inscription. Le contrôle au démarrage refuse une configuration non vérifiable ou qui permet l'inscription.

Docker traduit automatiquement les variables du tableau en variables internes du programme (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). Ne pas ajouter de clé privée avec un préfixe `VITE_` : ce préfixe rend une valeur accessible au navigateur. Seul `admin-init` reçoit le fichier du mot de passe ; le site ne le reçoit pas.

- Nouveau compte : création et attribution du rôle administrateur.
- Compte existant : conservé, sans changement du mot de passe.
- Réinitialisation volontaire : remplacer le fichier privé, puis `docker compose --env-file /etc/green-ivory/server.env -f deployment/compose.yaml run --rm admin-init bun scripts/provision-admin.ts --reset-password`.
- Un autre administrateur : même service avec une autre adresse `ADMIN_EMAIL`, choisie explicitement par le propriétaire du serveur.

Cette commande est privée et n'est pas un point d'accès du site. L'inscription publique est désactivée et le premier inscrit ne devient plus administrateur automatiquement.

Après un échec, corriger la configuration et relancer la commande de démarrage. Le service est réexécuté sans changer le mot de passe d'un compte existant. Après réussite, ouvrir `/auth` sur votre site, saisir l'adresse `ADMIN_EMAIL` et le mot de passe choisi, puis vérifier l'accès à `/admin`. Aucun envoi d'e-mail n'est requis pour ce compte provisionné et confirmé côté serveur. À chaque démarrage, aucune nouvelle attribution n'est faite à un visiteur.

## 4. Démarrer le site
Copier `deployment/runtime.env.example` dans un fichier privé **hors du dépôt**, compléter avec les valeurs de votre installation et relever le nom réel du réseau Docker du service. Les clés publiques sont incorporées dans le site ; la clé privilégiée est uniquement fournie au serveur à l'exécution.

Depuis le dossier du projet :

```sh
docker compose --env-file /etc/green-ivory/server.env -f deployment/compose.yaml up -d --build
```

La construction utilise une configuration autonome, sans l'enveloppe Vite de Lovable. Pour un essai local, utiliser une URL d'API accessible au navigateur local ; une adresse Docker interne ne fonctionne pas dans le navigateur.

Consulter l'état avec `docker compose --env-file /etc/green-ivory/server.env -f deployment/compose.yaml ps -a` : `admin-init` doit être terminé avec le code `0` et `site` en cours d'exécution. Les messages de création ne contiennent pas le mot de passe. Ne pas partager une sortie `docker compose config`, qui peut afficher les clés.

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