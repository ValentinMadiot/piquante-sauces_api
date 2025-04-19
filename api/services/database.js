//* IMPORT LIBRAIRIE MONGOOSE
const mongoose = require("mongoose");

//* VARIABLES D'ENVIRONEMENTS
const login = process.env.MONGODB_LOGIN;
const password = process.env.MONGODB_PASSWORD;

//* CONNEXTION A LA BASE DE DONNEE MONGODB AVEC L'ADRESSE
const uri = `mongodb+srv://${login}:${password}@user.rbdox.mongodb.net/?retryWrites=true&w=majority&appName=user`;
// const uri = "mongodb://127.0.0.1:27017/piquante"; //test local

if (!uri) {
  console.error(
    "❌ Erreur : MONGODB_LOGIN & MONGODB_PASSWORD non défini dans .env"
  );
  process.exit(1);
}

//* RESUTAT CONNEXION A MONGODB
mongoose.set("strictQuery", false);

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connexion à MongoDB réussie !"))
  .catch((err) => console.error("❌ Connexion à MongoDB échouée !", err));

//* EXPORT
module.exports = mongoose;
