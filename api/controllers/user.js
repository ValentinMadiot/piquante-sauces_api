const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//* CREER UN NOUVEL UTILISATEUR
async function signup(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}

//* CONNECTER UN UTILISATEUR EXISTANT
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Identifiants incorrects." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "24h",
    });
    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}

module.exports = { signup, login };
