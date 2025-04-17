require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

// 0. Connexion MongoDB (effet de bord)
require("./services/database");

const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

const app = express();

// Si vous tournez derrière un proxy (Railway, Vercel…)
app.set("trust proxy", 1);

// 1. Logging & Security
app.use(morgan("dev"));
app.use(helmet());

// 2. Body parsing
app.use(express.json());

// 3. CORS : liste paramétrable depuis l'env ou valeur par défaut
const whitelist = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST.split(",")
  : [
      "https://piiquante-production.up.railway.app",
      "https://piquante-sauces.vercel.app",
    ];

const corsOptions = {
  origin: (origin, callback) => {
    // Pas d’origin = Postman ou CLI → OK
    if (!origin || whitelist.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`Bloqué par CORS : ${origin}`), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // pré‑flight

// 4. Routes
app.use("/api", userRoute);
app.use("/api", sauceRoute);

// 5. Static files
app.use("/images", express.static(path.join(__dirname, "images")));

// 6. Error handler
app.use((err, req, res, next) => {
  console.error("💥 Erreur détectée :", err.message);
  if (err.message.startsWith("Bloqué par CORS")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// 7. Start server
const server = app.listen(port, () =>
  console.log(`✅ Serveur lancé sur le port ${port}`)
);
server.on("error", errorHandler);
