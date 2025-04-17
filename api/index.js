require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");

// Connexion à MongoDB (effet de bord)
require("./services/database");

const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

const app = express();

// 1. Logger HTTP
app.use(morgan("dev"));

// 2. Sécuriser les headers
app.use(helmet());

// 3. Parser le JSON
app.use(express.json());

// 4. Configuration CORS avancée
const allowedOrigins = [
  "https://piiquante-production.up.railway.app",
  "https://piiquante-sauces.vercel.app",
];
const vercelRegex = /\.vercel\.app$/; // autorise tous les sous‑domains Vercel
const railwayRegex = /\.railway\.app$/; // autorise tous les sous‑domains Railway

const corsOptions = {
  origin: (origin, callback) => {
    // Permet les requêtes sans Origin (Postman, certains clients mobile, etc.)
    if (!origin) {
      return callback(null, true);
    }
    // Autorise si dans la whitelist OU match regex Vercel/Railway
    if (
      allowedOrigins.includes(origin) ||
      vercelRegex.test(origin) ||
      railwayRegex.test(origin)
    ) {
      return callback(null, true);
    }
    // Sinon, bloqué
    callback(new Error(`Bloqué par CORS : origine non autorisée (${origin})`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204, // certains navigateurs (IE11) attendent 204 pour OPTIONS
};

// Applique CORS à toutes les routes, et gère explicitement les pre‑flights
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 5. Vos routes API
app.use("/api", userRoute);
app.use("/api", sauceRoute);

// 6. Servir les images statiques
app.use("/images", express.static(path.join(__dirname, "images")));

// 7. Middleware de gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error("💥 Erreur interne du serveur :", err.message);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// 8. Démarrage du serveur + gestion des erreurs d’écoute
const server = app.listen(port, () =>
  console.log(`✅ Serveur lancé sur le port ${port}`)
);
server.on("error", errorHandler);
