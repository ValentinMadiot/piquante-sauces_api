//* IMPORT JSONWEBTOKEN
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //* Vérifie si le header "Authorization" est présent
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    //* Récupérer le token après "Bearer"
    const token = req.headers.authorization.split(" ")[1];

    //* Vérifie si le token est bien récupéré
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    //* Vérifie que la clé JWT est bien définie
    if (!process.env.JWT_TOKEN) {
      console.error("JWT_TOKEN is not defined in environment variables.");
      return res.status(500).json({ error: "Internal server error" });
    }

    //* Décoder le token
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

    //* Récupérer "userId" du token
    const userId = decodedToken.userId;

    //* Ajouter "userId" pour que les routes puissent l'utiliser
    req.auth = { userId };

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
