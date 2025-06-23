<div align="center">  
    <a href="https://piquante-sauces.vercel.app/signup" target="_blank">  
      <img src=".docs/preview.png" alt="Aperçu du projet">  
    </a>
    </br>  
    </br>  
  <h3 align="center">🌶 Piquante - Projet Scolaire</h3>  
</div>

## <br /> 📌 Sommaire

&nbsp;&nbsp;&nbsp; 🎨 &nbsp; [**Introduction**](#introduction)<br />
&nbsp;&nbsp;&nbsp; 🛠️ &nbsp; [**Technologies**](#technologies)<br />
&nbsp;&nbsp;&nbsp; 🎯 &nbsp; [**Fonctionnalités**](#fonctionnalités)<br />
&nbsp;&nbsp;&nbsp; 🚧 &nbsp; [**Mise à Jour**](#upgrade)<br />
&nbsp;&nbsp;&nbsp; 🚀 &nbsp; [**Installation**](#installation)

## <br /> <a name="introduction">🎨 Introduction</a>

Piquante est une application web fullstack dédiée au partage de sauces piquantes.

Elle repose sur un backend **Node.js** / **Express** connecté à **MongoDB**, et un frontend **Angular** moderne et responsive.

Les utilisateurs peuvent s’inscrire, publier des sauces, voter (like/dislike), et gérer leurs propres créations via une API REST sécurisée.

> 📂 Pour plus de détails, consultez le [dossier](.docs/).

## <br /> <a name="technologies">🛠️ Technologies</a>

- **Backend** : Node.js, Express, Mongoose, bcrypt, JSON Web Token (JWT)
- **Frontend** : Angular, RxJS
- **Base de données** : MongoDB Atlas ou MongoDB Compass local
- **Déploiement** : Render (API), Vercel (UI)
- **Image hosting** : Cloudinary

## <br /> <a name="fonctionnalités">🎯 Fonctionnalités</a>

- **Inscription / Connexion** : Gestion sécurisée des utilisateurs avec hash bcrypt et JWT
- **CRUD Sauces** : Création, lecture, modification, suppression de sauces avec upload d'image
- **Like / Dislike** : Système de notation des sauces par les utilisateurs
- **Routes protégées** : Accès contrôlé via token JWT
- **Responsive design** : Optimisé pour desktop & mobile
- **Messages d’erreur explicites** : Feedbacks utilisateur améliorés
- **Upload d’images** : Hébergement des images avec Cloudinary

## <br /> <a name="upgrade">🚧 Mise à Jour</a>

Afin de rendre le projet déployable en production, plusieurs ajustements ont été apportés :

- **Cloudinary** a été intégré pour gérer efficacement l'hébergement et la livraison des images (compression, CDN, nettoyage automatique des fichiers inutiles)
- **Nouvelle gestion des erreurs** backend & frontend, avec feedback utilisateur
- **Détection automatique de l’environnement** (dev / prod)
- **Stockage intelligent d’authentification** (localStorage avec persistance)
- **Favicon & logo personnalisés**
- **Refonte graphique complète** pour desktop et mobile
- **Organisation** : séparation claire des dossiers `api/` pour le backend et `public/` pour le frontend
- **Déploiement** :
  - Backend sur **Render** (URL : `https://piquante-sauces-api.onrender.com`)
  - Frontend sur **Vercel** (URL : `https://piquante-sauces.vercel.app`)

## <br /> <a name="installation">🚀 Installation</a>

### ✅ Prérequis

- [Git](https://git-scm.com/) &nbsp;—&nbsp; Système de gestion de versions
- [Node.js](https://nodejs.org/fr) &nbsp;—&nbsp; Exécuteur local de scripts JavaScript
- [npm](https://www.npmjs.com/) &nbsp;—&nbsp; Gestionnaire de paquets JavaScript
- [MongoDB](https://www.mongodb.com/) — Base de données NoSQL
- [Google Chrome](https://www.google.com/) &nbsp;—&nbsp; Navigateur moderne
- [Visual Studio Code](https://code.visualstudio.com/) &nbsp;—&nbsp; Éditeur de code
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) &nbsp;—&nbsp; Extension VS Code

### 📥 Cloner le projet

```bash
git clone https://github.com/ValentinMadiot/piquante-sauces_api.git
```

### 📝 Configuration de l’environnement

Renommer `.env.exemple` en `.env`

Ajoutez les variables d’environnement dans le fichier `.env` :

```bash
# IDENTIFIANT BASE DE DONNEES (MongoDB)
MONGODB_URI_DEV=mongodb://localhost:00000/piquante
MONGODB_URI_PROD=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority

# PASSWORD JWT (JSON Web Token)
JWT_TOKEN=mon_secret_token
```

### ▶️ Lancer le projet

#### Backend

```bash
cd api
npm install
npm start
```

Backend disponible sur : `http://localhost:8080`

#### Frontend

```bash
cd public
npm install
npm start
```

Frontend disponible sur : `http://localhost:4200`
