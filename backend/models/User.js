//*--------------------------------------------------------------------------------
//*---------------------------------- LIBRAIRIE -----------------------------------
//*--------------------------------------------------------------------------------

//* IMPORT MONGOOSE
const mongoose = require('mongoose')

//* UTILISATION DE LA FONCTIONNALITE VALIDATION DE MONGOOSE
const uniqueValidator = require('mongoose-unique-validator')

//*--------------------------------------------------------------------------------
//*------------------------------------ OBJET -------------------------------------
//*--------------------------------------------------------------------------------

//* SCHEMA DE CONNEXION
const userSchema = new mongoose.Schema ({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})
//* VERIFICATION DU SCHEMA AVEC LE VALIDATEUR MONGOOSE
userSchema.plugin(uniqueValidator)

//* EXPORTATION DES DONNEES
module.exports = mongoose.model('User', userSchema)