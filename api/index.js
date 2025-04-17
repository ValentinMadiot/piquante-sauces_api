require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

// 0. Connexion MongoDB centralisée (effet de bord)
require("./services/database");

const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

const app = express();

// 1. Si vous êtes derrière un proxy (Railway), permet de récupérer le vrai Origin
app.set("trust proxy", 1);

// 2. Logger HTTP
app.use(morgan("dev"));

// 3. Sécuriser les headers HTTP
app.use(helmet());

// 4. Règles CORS
const explicitOrigins = [
  "https://piiquante-production.up.railway.app",
  "https://piquante-sauces.vercel.app",
];
const vercelPreview = /\.vercel\.app$/; // tous les sous‑domaines *.vercel.app
const railwayPreview = /\.railway\.app$/; // tous les sous‑domaines *.railway.app

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // Postman, mobile, etc. n’envoient pas d’Origin
      return callback(null, true);
    }
    if (
      explicitOrigins.includes(origin) ||
      vercelPreview.test(origin) ||
      railwayPreview.test(origin)
    ) {
      return callback(null, true);
    }
    callback(new Error(`Bloqué par CORS : origine non autorisée (${origin})`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204, // certains navigateurs attendent 204 sur OPTIONS
};

// 5. Appliquer CORS avant tout autre middleware qui renvoie une réponse
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // gérer explicitement tous les pré‑flights

// 6. Parser JSON
app.use(express.json());

// 7. Déclarer les routes
app.use("/api", userRoute);
app.use("/api", sauceRoute);

// 8. Servir les images statiques
app.use("/images", express.static(path.join(__dirname, "images")));

// 9. Middleware de gestion des erreurs (y compris CORS)
app.use((err, req, res, next) => {
  console.error("💥 Erreur détectée :", err.message);
  if (err.message && err.message.startsWith("Bloqué par CORS")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// 10. Démarrer le serveur et gérer les erreurs d’écoute
const server = app.listen(port, () => {
  console.log(`✅ Serveur lancé sur le port ${port}`);
});
server.on("error", errorHandler);
