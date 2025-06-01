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

Ce projet consiste en une application de partage de sauces piquantes, avec un backend **Node.js/Express** connecté à **MongoDB** pour gérer les utilisateurs et les sauces, et un frontend **Angular** pour une interface moderne et réactive.

- Le **backend** expose une API REST pour la création, la lecture, la mise à jour, la suppression (CRUD) de sauces, ainsi que l'authentification (signup/login) et la gestion des likes/dislikes.
- Le **frontend** Angular consomme cette API, affiche dynamiquement les sauces, permet l'upload d'images et la navigation.

📂 Pour plus de détails, consultez le [dossier](.docs/).

## <br /> <a name="technologies">🛠️ Technologies</a>

- **Backend** : Node.js, Express, Mongoose (MongoDB), bcrypt, JSON Web Token (JWT)
- **Frontend** : Angular, RxJS
- **Base de données** : MongoDB (via MongoDB Atlas ou MongoDB Compass local)
- **Déploiement** : Render (backend), Vercel (frontend)

## <br /> <a name="fonctionnalités">🎯 Fonctionnalités</a>

- **Inscription / Connexion** : Gestion sécurisée des utilisateurs avec hash bcrypt et JWT
- **CRUD Sauces** : Création, lecture, modification, suppression de sauces avec upload d'image
- **Like / Dislike** : Système de notation des sauces par les utilisateurs
- **Upload d’images** : Ajout et affichage dynamique des images
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

### ✅ Pré-requis

- 🛠️ **[Git](https://git-scm.com/)**
- 🔧 **[Node.js](https://nodejs.org/fr/)**
- 📦 **[npm](https://www.npmjs.com/)**
- 🍃 **[MongoDB](https://www.mongodb.com/)** (Atlas ou local)

### 📥 Cloner le projet

```bash
git clone https://github.com/ValentinMadiot/piquante-sauces_api.git
```

### 📝 Configuration des variables d’environnement

#### Backend (API)

Renommer `.env.exemple` en `.env`

```env
# IDENTIFIANT BASE DE DONNEES (MongoDB)
MONGODB_URI_DEV=
MONGODB_URI_PROD=

# PASSWORD JWT (JSON Web Token)
JWT_TOKEN=
```

### ▶️ Lancer l’application

#### Backend (port : 8080)

```bash
cd api
npm install
npm start
```

#### Frontend (port : 4200)

```bash
cd public
npm install
npm start
```
