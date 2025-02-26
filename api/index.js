require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

//* IMPORT DATABASE
require("./services/database");

const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

const app = express();

app.on("error", errorHandler);
app.on("listening", () => {
  const address = app.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

//* CORS CONFIGURATION
const corsOptions = {
  origin: "https://piquante-sauces.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Applique CORS à toutes les routes
app.use(cors(corsOptions));

// Gère les requêtes preflight OPTIONS
app.options("*", cors(corsOptions));

//* HELMET => PROTEGE L'APPLICATION DE CERTAINES VULNERABILITES EN CONFIGURANT DE MANIERE APPROPRIEE DES HEADERS HTTP
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

//* PARSER => ANALYSE LE CORPS D'UNE REQUETE HTTP, ASSEMBLE LES DONNEES, CREE UN OBJET BODY EXPLOITABLE
app.use(express.json());

app.use(userRoute);
app.use(sauceRoute);

//! CHEMIN IMAGE
app.use("/images", express.static(path.join(__dirname, "/images")));

//! LANCEMENT SUR LE PORT
app.listen(port, () => console.log("Listening on port : " + port));
