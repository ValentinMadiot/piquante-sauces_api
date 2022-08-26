//*--------------------------------------------------------------------------------
//*--------------------------- BASE DE DONNEES MONGODB ----------------------------
//*--------------------------------------------------------------------------------

//* APPEL/IMPORT LIBRAIRIE MONGOOSE
const mongoose = require('mongoose');

//* VARIABLES D'ENVIRONEMENTS
const password = process.env.PASSWORD
const login = process.env.LOGIN

//* CONNEXTION A LA BASE DE DONNEE MONGODB
mongoose.connect(`mongodb+srv://${login}:${password}@sauces.erngyxz.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Connexion à MongoDB échouée !' + err))

//* EXPORT
module.exports = mongoose