require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");
const database = require("./services/database");
const { port, errorHandler } = require("./config");
const userRoute = require("./routes/user");
const sauceRoute = require("./routes/sauce");

const app = express();
app.use(morgan("dev"));
const corsOptions = {
  origin: [
    "https://piquante-sauces.vercel.app",
    "http://localhost:4200",
    "http://localhost:8080",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(helmet());

app.use("/api", userRoute);
app.use("/api", sauceRoute);
app.use("/images", express.static(path.join(__dirname, "images")));

app.listen(port, () => console.log(`✅ Serveur lancé sur le port ${port}`));
