require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");

//* IMPORT DATABASE
require("./services/database");

const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

const app = express(); // ✅ Déclare app AVANT de l'utiliser

app.use(morgan("dev")); // Affiche les logs des requêtes HTTP

app.on("error", errorHandler);
app.on("listening", () => {
  console.log(`Listening on port ${port}`);
});

//* Middleware pour ajouter les headers CORS sur toutes les réponses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Mets ton domaine en prod
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // ✅ Évite l'erreur 405 sur preflight requests
  }
  next();
});

app.use(cors()); // ✅ Active CORS
app.use(helmet()); // ✅ Sécurise les headers HTTP

//* PARSER => Analyse le corps des requêtes
app.use(express.json());

//* Routes
app.use("/api", userRoute);
app.use(sauceRoute);

//! CHEMIN IMAGE
app.use("/images", express.static(path.join(__dirname, "/images")));

//! LANCEMENT DU SERVEUR
app.listen(port, () => console.log("Listening on port : " + port));
