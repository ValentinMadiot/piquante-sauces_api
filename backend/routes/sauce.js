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
//*-------------------------------- ROUTES SAUCES ---------------------------------
//*--------------------------------------------------------------------------------

//* POST UNE CREATION DE SAUCE D'UN CLIENT
router.post('/api/sauces', auth, multer, createSauce)

//* PUBLI LES DONNEES DE CHAQUE SAUCES SUR LA PAGE ALL SAUCES
router.get('/api/sauces', auth, getAllSauces)

//* PUBLI LES DONNEES D'UNE SAUCE SUR SA PAGE
router.get('/api/sauces/:id', auth, getOneSauce)

//* MODIFIE UNE SAUCE DU CLIENT
router.put('/api/sauces/:id', auth, multer, modifySauce)

//* SUPPRIME UNE SAUCE DU CLIENT
router.delete('/api/sauces/:id', auth, deleteSauce)

//* LIKER OU DISLIKER UNE SAUCE CLIENT
router.post('/api/sauces/:id/like', auth, likeDislikeSauce)

//* EXPORTATION DES ROUTES
module.exports = router