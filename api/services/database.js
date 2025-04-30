const mongoose = require("mongoose");

// On lit une NODE_ENV standard de Node.js
const env = process.env.NODE_ENV || "development";

// On récupère les deux URI depuis l’env
const uriDev = process.env.MONGODB_URI_DEV;
const uriProd = process.env.MONGODB_URI_PROD;

// On choisit la bonne URI suivant l’environnement
const uri = env === "production" ? uriProd : uriDev;

if (!uri) {
  console.error(
    `❌ Erreur : MONGODB_URI_${env.toUpperCase()} non défini dans .env`
  );
  process.exit(1);
}

// Configuration Mongoose
mongoose.set("strictQuery", false);

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`✅ MongoDB connecté (${env})`))
  .catch((err) => console.error("❌ Échec de connexion MongoDB :", err));

module.exports = mongoose;
