require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");

// Initialise la connexion MongoDB
require("./services/database");

const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

const app = express();

// 1. Logging des requêtes
app.use(morgan("dev"));

// 2. Sécurisation des en‑têtes HTTP
app.use(helmet());

// 3. Parsing JSON
app.use(express.json());

// 4. CORS : lister les origines autorisées (avec le schéma complet pour production)
const corsOptions = {
  origin: [
    "https://piiquante-production.up.railway.app",
    "https://piquante-sauces.vercel.app",
    "http://localhost:4200",
    "http://localhost:8080",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// 5. Routes
app.use("/api", userRoute);
app.use("/api", sauceRoute);

// 6. Fichiers statiques (images)
app.use("/images", express.static(path.join(__dirname, "images")));

// 7. Gestionnaire d’erreurs global
app.use((err, req, res, next) => {
  console.error("💥 Erreur interne du serveur :", err);
  res
    .status(500)
    .json({ message: "Erreur interne du serveur", error: err.message });
});

// 8. Démarrage du serveur et gestion des erreurs d’écoute
const server = app.listen(port, () => {
  console.log(`✅ Serveur lancé sur le port ${port}`);
});
server.on("error", errorHandler);
