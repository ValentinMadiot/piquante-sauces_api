const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant ou invalide." });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    req.auth = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: "Token invalide ou expiré." });
  }
};
