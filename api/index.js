require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

// Connexion MongoDB (side-effect)
require("./services/database");

const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

const app = express();

// 1) CORS whitelist (dev & prod)
const whitelist = [
  "http://localhost:4200", // Angular dev
  "https://piquante-sauces.vercel.app", // Front prod
];
app.use(
  cors({
    origin: (origin, cb) => {
      // Postman/Curl (no origin) => OK
      if (!origin) return cb(null, true);
      // Origine dans la whitelist => OK
      if (whitelist.includes(origin)) return cb(null, true);
      // Sinon => blocage
      return cb(new Error(`CORS bloqué : ${origin}`), false);
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.options("*", cors()); // pré-vols OPTIONS

// 2) Sécurité HTTP
app.use(
  helmet({
    contentSecurityPolicy: false, // désactive CSP en dev
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 3) Logger HTTP
app.use(morgan("dev"));

// 4) Body parser JSON
app.use(express.json());

// 5) Routes API
// → /api/auth/signup  &  /api/auth/login
app.use("/api", userRoute);
// → /api/sauces/*
app.use("/api", sauceRoute);

// 6) Images statiques
// → /images/<filename>
app.use("/images", express.static(path.join(__dirname, "images")));

// 7) Gestionnaire d’erreurs global
app.use((err, req, res, next) => {
  console.error("💥 Erreur détectée :", err.message);
  if (err.message.startsWith("CORS bloqué")) {
    return res.status(403).json({ message: err.message });
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || "Erreur interne du serveur" });
});

// 8) Démarrage du serveur
const server = app.listen(port, () =>
  console.log(`✅ Serveur lancé sur le port ${port}`)
);
server.on("error", errorHandler);
