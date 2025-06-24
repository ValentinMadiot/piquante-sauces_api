//* CLOUDINARY CONFIGUE
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

// 1) CORS Global (dev + prod)
app.use(cors());
app.options("*", cors());

// 2) Sécurité HTTP
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 3) Logger HTTP
app.use(morgan("dev"));

// 4) Body Parser JSON
app.use(express.json());

// 5) Images Statiques (dev uniquement ou fallback local)
app.use("/images", express.static(path.join(__dirname, "images")));

// 6) Routes API
app.use("/api", userRoute);
app.use("/api", sauceRoute);

// 7) Middleware d’Erreurs Global
app.use((err, req, res, next) => {
  console.error("💥 Erreur détectée :", err.message);
  if (err.message && err.message.startsWith("CORS bloqué")) {
    return res.status(403).json({ message: err.message });
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || "Erreur interne du serveur" });
});

// 8) Démarrage du Serveur
const server = app.listen(port, () =>
  console.log(`✅ Serveur lancé sur le port ${port}`)
);
server.on("error", errorHandler);

//* SCHOOL PROJECT
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const path = require("path");

// // Connexion MongoDB (side-effect)
// require("./services/database");

// const { port, errorHandler } = require("./config");
// const userRoute = require("./routes/user");
// const sauceRoute = require("./routes/sauce");

// const app = express();

// // 1) CORS pour TOUTES origines (prod + dev)
// app.use(cors());
// app.options("*", cors());

// // 2) Sécurité HTTP
// app.use(
//   helmet({
//     contentSecurityPolicy: false, // désactive CSP en dev
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//   })
// );

// // 3) Logger HTTP
// app.use(morgan("dev"));

// // 4) Body parser JSON
// app.use(express.json());

// // 5) Routes API
// // → /api/auth/signup  &  /api/auth/login
// app.use("/api", userRoute);
// // → /api/sauces/*
// app.use("/api", sauceRoute);

// // 6) Images statiques
// // → /images/<filename>
// app.use("/images", express.static(path.join(__dirname, "images")));

// // 7) Gestionnaire d’erreurs global
// app.use((err, req, res, next) => {
//   console.error("💥 Erreur détectée :", err.message);
//   if (err.message.startsWith("CORS bloqué")) {
//     return res.status(403).json({ message: err.message });
//   }
//   res
//     .status(err.status || 500)
//     .json({ message: err.message || "Erreur interne du serveur" });
// });

// // 8) Démarrage du serveur
// const server = app.listen(port, () =>
//   console.log(`✅ Serveur lancé sur le port ${port}`)
// );
// server.on("error", errorHandler);
