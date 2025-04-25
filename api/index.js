require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

// Connexion MongoDB (side-effect)
require("./services/database");

const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

const app = express();

// 0) PRE-FLIGHT handler pour toutes les OPTIONS (On répond 204 avec tous les Access-Control-Allow-)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.header("Origin") || "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});

// 1) CORS whitelist
const whitelist = [
  "http://localhost:4200", // dev Angular
  "https://piquante-sauces.vercel.app", // prod front
];
app.use(
  cors({
    origin: (origin, callback) => {
      // autoriser Postman ou mobiles (no origin) et les domaines listés
      if (!origin || whitelist.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS bloqué : ${origin}`), false);
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// 2) Sécurité HTTP légère
app.use(
  helmet({
    contentSecurityPolicy: false, // désactivée en dev pour éviter blocages
    crossOriginResourcePolicy: { policy: "cross-origin" }, // images cross-origin
  })
);

// 3) Logger HTTP
app.use(morgan("dev"));

// 4) Parser JSON
app.use(express.json());

// 5) Routes API
app.use("/api", userRoute);
app.use("/api", sauceRoute);

// 6) Images statiques
app.use(
  "/images",
  (req, res, next) => {
    // autorise tout le monde pour les ressources images
    res.header("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(path.join(__dirname, "images"))
);

// 7) Error handler global
app.use((err, req, res, next) => {
  console.error("💥 Erreur détectée :", err.message);
  if (err.message.startsWith("CORS bloqué")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// 8) Démarrage du serveur
const server = app.listen(port, () =>
  console.log(`✅ Serveur lancé sur le port ${port}`)
);
server.on("error", errorHandler);
