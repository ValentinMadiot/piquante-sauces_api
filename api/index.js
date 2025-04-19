require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

// Connexion MongoDB (side‑effect)
require("./services/database");

const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

const app = express();
const isProd = process.env.NODE_ENV === "production";

// 1) Sécurité HTTP légère
app.use(
  helmet({
    // Désactive la Content Security Policy en dev pour éviter tout blocage
    contentSecurityPolicy: false,
    // Autorise le chargement d’images cross‑origin
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 2) Logger des requêtes
app.use(morgan("dev"));

// 3) CORS (tout accepter en dev, whitelist en prod)
const allowedOrigins = [
  "https://piiquante-production.up.railway.app",
  "https://piquante-sauces.vercel.app",
];
app.use(
  cors({
    origin: isProd
      ? (origin, cb) =>
          allowedOrigins.includes(origin)
            ? cb(null, true)
            : cb(new Error(`CORS bloqué: ${origin}`))
      : true,
    credentials: true,
  })
);

// 4) Parser JSON
app.use(express.json());

// 5) Routes API
app.use("/api", userRoute);
app.use("/api", sauceRoute);

// 6) Images publiques (avec CORS *)
app.use(
  "/images",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(path.join(__dirname, "images"))
);

// 7) Gestionnaire d’erreurs global
app.use((err, req, res, next) => {
  console.error("💥 Erreur détectée :", err.message);
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
