const express = require("express");
const emailValidator = require("../middleware/email-validator");
const passwordValidator = require("../middleware/password-validator");
const { signup, login } = require("../controllers/user");

const router = express.Router();

//* CONTROLE LA CREATION D'UN NOUVEL UTILISATEUR
router.post("/auth/signup", emailValidator, passwordValidator, signup);

//* CONTROLE L'EXISTANCE D'UN UTILISATEUR DANS LA BASE DE DONNEE
router.post("/auth/login", login);

module.exports = router;
