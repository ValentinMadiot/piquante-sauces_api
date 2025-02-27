//* IMPORT JSONWEBTOKEN
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log(
      "🔍 [AUTH] Header Authorization reçu:",
      req.headers.authorization
    );

    //* Vérifie si le header "Authorization" est présent
    if (!req.headers.authorization) {
      console.log("❌ [AUTH] Aucun header Authorization !");
      return res.status(401).json({ error: "Authorization header missing" });
    }

    //* Récupérer le token après "Bearer"
    const token = req.headers.authorization.split(" ")[1];
    console.log("🔍 [AUTH] Token extrait:", token);

    //* Vérifie si le token est bien récupéré
    if (!token) {
      console.log("❌ [AUTH] Token vide !");
      return res.status(401).json({ error: "Token missing" });
    }

    //* Vérifie que la clé JWT est bien définie
    if (!process.env.JWT_TOKEN) {
      console.error("JWT_TOKEN is not defined in environment variables.");
      return res.status(500).json({ error: "Internal server error" });
    }

    //* Décoder le token
    console.log("🔍 [AUTH] JWT_TOKEN chargé:", process.env.JWT_TOKEN);
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    console.log("✅ [AUTH] Token décodé avec succès:", decodedToken);

    //* Récupérer "userId" du token
    const userId = decodedToken.userId;

    //* Ajouter "userId" pour que les routes puissent l'utiliser
    req.auth = { userId };

    next();
  } catch (error) {
    console.log("❌ [AUTH] Erreur JWT:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
