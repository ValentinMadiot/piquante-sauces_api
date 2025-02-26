require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev")); // Affiche les logs des requêtes HTTP

//* IMPORT DATABASE
require("./services/database");

const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

//* CORS CONFIGURATION (AVANT TOUT)
app.use(
  cors({
    origin: "https://piquante-me5bryhmp-valentinmdts-projects.vercel.app", // Ton frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true, // Active si besoin d’envoyer des cookies ou des headers d’authentification
  })
);

//* GÈRE LES REQUÊTES OPTIONS (PRE-FLIGHT)
app.options("*", cors());

//* DEBUG : LOG DES HEADERS POUR VÉRIFICATION
app.use((req, res, next) => {
  console.log("CORS Headers:", res.getHeaders());
  next();
});

//* PARSER => ANALYSE LE CORPS D'UNE REQUÊTE HTTP
app.use(express.json());

app.use("/api", userRoute);
app.use("/api", sauceRoute);

//! CHEMIN IMAGE
app.use("/images", express.static(path.join(__dirname, "/images")));

//! LANCEMENT SUR LE PORT
app.listen(port, () => console.log("Listening on port : " + port));
