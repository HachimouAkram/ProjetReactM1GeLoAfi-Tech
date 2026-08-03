# 🚀 Plateforme de Réseau Professionnel & Portfolios

Une application web développée en **React JS** permettant de centraliser les portfolios de différents professionnels. Ce projet a évolué d'une simple gestion de portfolio individuel à un véritable mini-réseau social professionnel.

## ✨ Fonctionnalités Principales
- **Authentification complète** : Inscription, connexion et persistance de session (via React Context et SessionStorage).
- **Réseau multi-acteurs** : Découverte des professionnels inscrits avec une barre de recherche dynamique (par nom, prénom ou profil professionnel).
- **Gestion de Portfolio (CRUD)** : Chaque utilisateur est administrateur de son propre espace. Il peut ajouter, modifier ou supprimer ses projets et compétences.
- **Affichage dynamique** : Interfaces modernes, adaptatives, et séparation claire entre projets réalisés et compétences techniques.

## 🛠️ Technologies Utilisées
- **Frontend** : React JS, React Router DOM, CSS natif.
- **Backend / API** : JSON-Server (API REST factice avec `base.json`).
- **Serveur de déploiement** : Express.js (Node) pour servir l'application React et l'API sur le même port.

## ⚙️ Installation en local (Développement)

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votre-nom-utilisateur/mgelo126_hachimou_akram_react.git
   cd mgelo126_hachimou_akram_react
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le projet** :
   Pour démarrer à la fois l'interface React et le serveur d'API localement :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000` et l'API sur le port `3001`.

## 🌐 Déploiement (Production)
Le projet est configuré pour être déployé facilement sur une plateforme comme **Render.com** en tant que Web Service Node.js, grâce au fichier `server.js` inclus qui orchestre le frontend et le backend.
Commande de build : `npm install && npm run build`
Commande de démarrage : `npm start`
