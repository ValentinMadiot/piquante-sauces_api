require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const isProd = process.env.NODE_ENV === "production";

//* 0. Connexion MongoDB (side‑effect)
require("./services/database");

const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

const app = express();

//* 1. Trust proxy pour récupérer le vrai Origin
app.set("trust proxy", 1);

//* 2. Handler MANUEL des pré‑vols OPTIONS, AVANT tout autre middleware
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    // On renvoie nous‑mêmes un 204 avec tous les headers CORS
    return res
      .header("Access-Control-Allow-Origin", req.get("Origin") || "*")
      .header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
      )
      .header("Access-Control-Allow-Headers", "Content-Type,Authorization")
      .status(204)
      .end();
  }
  next();
});

//* 3. Logging & sécurité
app.use(morgan("dev"));
app.use(helmet());

//* 4. Parsing JSON
app.use(express.json());

// Liste des origines autorisées en prod
const allowedOrigins = isProd
  ? [
      "https://piiquante-production.up.railway.app",
      "https://piquante-sauces.vercel.app",
    ]
  : []; // Vide en dev : on autorisera tout

app.use(
  cors({
    origin: (origin, callback) => {
      // En dev (NODE_ENV != 'production'), on accepte tout
      if (!isProd) return callback(null, true);
      // En prod, on vérifie la whitelist
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Bloqué par CORS : ${origin}`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// //* 5. CORS « standard » (pour les vraies routes, après le pré‑vol)
// const whitelist = process.env.CORS_WHITELIST
//   ? process.env.CORS_WHITELIST.split(",")
//   : [
//       "https://piiquante-production.up.railway.app",
//       "https://piquante-sauces.vercel.app",
//     ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || whitelist.includes(origin)) return callback(null, true);
//     callback(new Error(`Bloqué par CORS : ${origin}`), false);
//   },
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));

//* 6. Routes
app.use("/api", userRoute);
app.use("/api", sauceRoute);

//* 7. Fichiers statiques
app.use("/images", express.static(path.join(__dirname, "images")));

//* 8. Gestionnaire d’erreurs
app.use((err, req, res, next) => {
  console.error("💥 Erreur détectée :", err.message);
  if (err.message.startsWith("Bloqué par CORS")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: "Erreur interne du serveur" });
});

//* 9. Démarrage du serveur
const server = app.listen(port, () =>
  console.log(`✅ Serveur lancé sur le port ${port}`)
);
server.on("error", errorHandler);
