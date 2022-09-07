
//*--------------------------------------------------------------------------------
//*---------------------------------- LIBRAIRIE -----------------------------------
//*--------------------------------------------------------------------------------

//* IMPORT LIBRAIRIE MONGOOSE
const mongoose = require('mongoose')

//*--------------------------------------------------------------------------------
//*--------------------------- BASE DE DONNEES MONGODB ----------------------------
//*--------------------------------------------------------------------------------

//* VARIABLES D'ENVIRONEMENTS
const password = process.env.MONGODB_PASSWORD
const login = process.env.MONGODB_LOGIN

//* CONNEXTION A LA BASE DE DONNEE MONGODB AVEC L'ADRESSE
const uri = `mongodb+srv://${login}:${password}@sauces.erngyxz.mongodb.net/?retryWrites=true&w=majority`

//* RESUTAT CONNEXION A MONGODB
mongoose
  .connect(uri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Connexion à MongoDB échouée !' + err))

//* EXPORT
module.exports = { mongoose }