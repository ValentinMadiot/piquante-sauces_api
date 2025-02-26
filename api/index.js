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

//* Configuration CORS
const corsOptions = {
  origin: ["https://piquante-sauces.vercel.app", "http://localhost:4200"], // Localhost pour tester en local
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Permet d'envoyer des cookies ou headers d'authentification
  allowedHeaders: ["Content-Type", "Authorization"], // Autoriser ces headers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Pour gérer les requêtes OPTIONS (pré-vol)

//* PARSER => ANALYSE LE CORPS D'UNE REQUÊTE HTTP
app.use(express.json());

//! SÉCURITÉ : Utilisation de Helmet
app.use(helmet());

//* ROUTES API
app.use("/api", userRoute);
app.use("/api", sauceRoute);

//! CHEMIN IMAGE
app.use("/images", express.static(path.join(__dirname, "/images")));

//! LANCEMENT SUR LE PORT
app.listen(port, () => console.log("✅ Serveur lancé sur le port : " + port));
