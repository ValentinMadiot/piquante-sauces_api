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
&nbsp;&nbsp;&nbsp; 🎯 &nbsp; [**Fonctionnalités**](#fonctionnalites)<br />
&nbsp;&nbsp;&nbsp; 🚧 &nbsp; [**Mise à Jour & Déploiement**](#upgrade)<br />
&nbsp;&nbsp;&nbsp; 🚀 &nbsp; [**Installation**](#installation)

## <br /> 🎨 Introduction

Ce projet consiste en une application de partage de sauces piquantes, avec un backend **Node.js/Express** connecté à **MongoDB** pour gérer les utilisateurs et les sauces, et un frontend **Angular** pour une interface moderne et réactive.

- Le **backend** expose une API REST pour la création, la lecture, la mise à jour, la suppression (CRUD) de sauces, ainsi que l'authentification (signup/login) et la gestion des likes/dislikes.
- Le **frontend** Angular consomme cette API, affiche dynamiquement les sauces, permet l'upload d'images et la navigation client-side.

## <br /> 🛠️ Technologies

- **Backend** : Node.js, Express, Mongoose (MongoDB), bcrypt, JSON Web Token
- **Frontend** : Angular, RxJS, Tailwind CSS (ou Bootstrap selon implémentation)
- **Base de données** : MongoDB (via MongoDB Atlas ou MongoDB Compass local)
- **Déploiement** : Railway (backend), Vercel (frontend)

## <br /> 🎯 Fonctionnalités

- **Inscription / Connexion** : gestion sécurisée des utilisateurs avec hash bcrypt et JWT
- **CRUD Sauces** : création, lecture, modification, suppression de sauces avec upload d'image
- **Like / Dislike** : système de notation des sauces par les utilisateurs
- **Routes protégées** : accès contrôlé via token JWT
- **Affichage dynamique** : interface Angular réactive, routing client-side
- **Upload d’images** : gestion des fichiers statiques avec Express

## <br /> 🚧 Mise à Jour & Déploiement

Afin de rendre le projet déployable en production, plusieurs ajustements ont été apportés :

- **CORS** : configuration CORS sur le backend pour autoriser les requêtes depuis le frontend Vercel ou localhost
- **Preflight OPTIONS** : gestion manuelle des requêtes pré-vol OPTIONS pour éviter les 405
- **Organisation** : séparation claire des dossiers `api/` pour le backend et `public/` pour le frontend
- **Déploiement** :
  - Backend sur **Railway** (URL : `https://piiquante-production.up.railway.app`)
  - Frontend sur **Vercel** (URL : `https://piquante-sauces.vercel.app`)

## <br /> 🚀 Installation

### ✅ Pré-requis

- 🛠️ **[Git](https://git-scm.com/)**
- 🔧 **[Node.js](https://nodejs.org/fr/)**
- 📦 **[npm](https://www.npmjs.com/)**
- 🍃 **[MongoDB](https://www.mongodb.com/)** (Atlas ou local)

### 📝 Configuration du fichier .env

Pour que l'API puisse se connecter à MongoDB et signer les tokens JWT, renommez le fichier `.env.example` en `.env` dans le dossier `api/`, puis ouvrez `api/.env` et renseignez vos variables :

```bash
cp api/.env.example api/.env
```

```dotenv
MONGODB_URI_PROD=votre_uri_mongodb
MONGODB_URI_DEV=mongodb://127.0.0.1:27017/piquante
JWT_TOKEN=votre_cle_secrete_jwt
```

### 📥 Cloner le projet

```bash
git clone https://github.com/ValentinMadiot/piquante-sauces_api.git
```

### ⚙️ Installer les dépendances du backend

```bash
cd api
npm install
```

### ▶️ Lancer le backend

```bash
npm start
```

Le serveur backend tourne sur : [http://localhost:8080](http://localhost:8080)

### 📦 Installer les dépendances du frontend

```bash
cd public
npm install
```

### ▶️ Lancer le frontend en développement

```bash
ng serve --proxy-config src/proxy.conf.json
```

Le frontend Angular tourne sur : [http://localhost:4200](http://localhost:4200)

---

> Pour plus de détails, consultez le [docs](/.docs) pour captures d’écran et diagrammes d’architecture. Tu as oublié de parler du fichier .env
