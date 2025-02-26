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

//* HELMET => PROTEGE L'APPLICATION DE CERTAINES VULNERABILITES EN CONFIGURANT DE MANIERE APPROPRIEES DES HEADERS HTTP
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

//* PARAMETRAGE DES HEADERS HTTP

app.use(cors());
app.use(
  cors({
    origin: "https://piquante-sauces.vercel.app",
  })
);

app.use((req, res, next) => {
  // ACCEDER A NOTRE API DEPUIS N'IMPORTE QUELLE ORIGINE
  res.setHeader("Access-Control-Allow-Origin", "*");
  // AJOUTER LES HEADERS MENTIONNEES AUX REQUETES ENVOYEES VERS NOTRE API
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // ENVOYER DES REQUETES AVEC LES METHODES MENTIONNEES
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//* PARSER =>  ANALYSE LE CORPS D'UNE REQUETE HTTP, ASSEMBLE LES DONNEES, CREE UN OBJET BODY EXPLOITABLE
app.use(express.json());

app.use(userRoute);
app.use(sauceRoute);

//! CHEMIN IMAGE
app.use("/images", express.static(path.join(__dirname, "/images")));

//! LANCEMENT SUR LE PORT
app.listen(port, () => console.log("Listening on port : " + port));
