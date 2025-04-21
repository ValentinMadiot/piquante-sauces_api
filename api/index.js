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
const whitelist = [
  "http://localhost:4200", // dev Angular
  "https://piquante-sauces.vercel.app", // prod Front
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman ou mobiles sans Origin passent
      if (!origin || whitelist.includes(origin)) return callback(null, true);
      callback(new Error(`CORS bloqué : ${origin}`), false);
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// gère les OPTIONS automatiquement pour toutes les routes
app.options("*", cors());

// 4) Parser JSON
app.use(express.json());

// 5) Routes API
app.use("/api", userRoute);
app.use("/api", sauceRoute);

// 6) Images publiques (avec CORS *)
app.use("/images", express.static(path.join(__dirname, "images")));

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
