const express = require("express");
const { signup, login } = require("../controllers/user");

const router = express.Router();

//* CONTROLE LA CREATION D'UN NOUVEL UTILISATEUR
router.post("/auth/signup", signup);

//* CONTROLE L'EXISTANCE D'UN UTILISATEUR DANS LA BASE DE DONNEE
router.post("/auth/login", login);

module.exports = router;
