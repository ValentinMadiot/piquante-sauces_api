//*--------------------------------------------------------------------------------
//*------------------------- LIBRAIRIE + FICHIER IMPORTE --------------------------
//*--------------------------------------------------------------------------------

//* IMPORT EXPRESS
const express = require('express')

//* IMPORT DE LA CONFIGURATION D'AUTHENTIFICATION
const auth = require('../middleware/auth')

//* IMPORT DE LA CONFIGURATION MULTER
const multer = require('../middleware/multer-config')

//* IMPORT DES FONCTIONS/LOGIQUES METIERS
const { getAllSauces, createSauce, getOneSauce, modifySauce, deleteSauce, likeDislikeSauce } = require("../controllers/sauce")

//* DECLARE ROUTER D'EXPRESS
const router = express.Router()

//*--------------------------------------------------------------------------------
//*------------------------------------ ROUTES ------------------------------------
//*--------------------------------------------------------------------------------

//* POST UNE CREATION D'OBJET D'UN CLIENT
router.post('/api/sauces', auth, multer, createSauce)

//* PUBLI LES DONNEES DE CHAQUE PRODUITS SUR LA PAGE D'ACCUEIL
router.get('/api/sauces', auth, getAllSauces)

//* PUBLI LES DONNEES DU PRODUIT SUR LA PAGE PRODUIT
router.get('/api/sauces/:id', auth, getOneSauce)

//* MODIFICATION D'UN PRODUIT DU CLIENT
router.put('/api/sauces/:id', auth, multer, modifySauce)

//* SUPPRESSION D'UN PRODUIT DU CLIENT
router.delete('/api/sauces/:id', auth, deleteSauce)

//* LIKER OU DISLIKER UN PRODUIT CLIENT
router.post('/api/sauces/:id/like', auth, likeDislikeSauce)

//* EXPORTATION DES ROUTES
module.exports = router