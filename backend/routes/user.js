//*--------------------------------------------------------------------------------
//*------------------------- LIBRAIRIE + FICHIER IMPORTE --------------------------
//*--------------------------------------------------------------------------------

//* IMPORT EXPRESS
const express = require('express')

//* IMPORT LE CONTROLE DES UTILISATEURS
const { signup, login } = require("../controllers/user")

//* DECLARE ROUTER D'EXPRESS
const router = express.Router()

//*--------------------------------------------------------------------------------
//*------------------------------ ROUTES CONNECTION -------------------------------
//*--------------------------------------------------------------------------------

//* CONTROLE LA CREATION D'UN NOUVEL UTILISATEUR
router.post('/api/auth/signup', signup)

//* CONTROLE L'EXISTANCE D'UN UTILISATEUR DANS LA BASE DE DONNEE
router.post('/api/auth/login', login)

//* EXPORTATION DES ROUTES
module.exports = router