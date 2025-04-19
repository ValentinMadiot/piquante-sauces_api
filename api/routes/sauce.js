const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//* IMPORT DES FONCTIONS/LOGIQUES METIERS
const {
  getAllSauces,
  createSauce,
  getOneSauce,
  modifySauce,
  deleteSauce,
  likeDislikeSauce,
} = require("../controllers/sauce");

//* DECLARE ROUTER D'EXPRESS
const router = express.Router();

//* ROUTES SAUCES
router.post("/sauces", auth, multer, createSauce);
router.get("/sauces", auth, getAllSauces);
router.get("/sauces/:id", auth, getOneSauce);
router.put("/sauces/:id", auth, multer, modifySauce);
router.delete("/sauces/:id", auth, deleteSauce);
router.post("/sauces/:id/like", auth, likeDislikeSauce);

//* EXPORTATION DES ROUTES
module.exports = router;
