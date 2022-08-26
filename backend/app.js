//*--------------------------------------------------------------------------------
//*------------------------- LIBRAIRIE + FICHIER IMPORTE --------------------------
//*--------------------------------------------------------------------------------

//* IMPORT + DECLARATION DOTENV
require('dotenv').config()

//* APPEL/IMPORT EXPRESS
const express = require('express')
//* DECLARE EXPRESS
const app = express()
//* UTILISATION de la libraire EXPRESS
app.use(express.json())

// 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next()
})

//* EXPORTATION des données 
module.exports = app