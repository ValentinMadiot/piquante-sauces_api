const express = require("express");
const { signup, login } = require("../controllers/user");

//* DECLARE ROUTER D'EXPRESS
const router = express.Router();

//* GESTION DES REQUÊTES OPTIONS (CORS Preflight)
router.options("/api/auth/signup", cors()); // Gère la requête OPTIONS pour /auth/signup
router.options("/api/auth/login", cors()); // Gère la requête OPTIONS pour /auth/login

//* CONTROLE LA CREATION D'UN NOUVEL UTILISATEUR
router.post("/api/auth/signup", signup);

//* CONTROLE L'EXISTANCE D'UN UTILISATEUR DANS LA BASE DE DONNEE
router.post("/api/auth/login", login);

//* EXPORTATION DES ROUTES
module.exports = router;
