//*--------------------------------------------------------------------------------
//*------------------------- LIBRAIRIE + FICHIER IMPORTE --------------------------
//*--------------------------------------------------------------------------------

//* IMPORT BCRYPT
const bcrypt = require('bcrypt')

//* IMPORT JSONWEBTOKEN
const jwt = require('jsonwebtoken')

//* IMPORT DES MODELES UTILISATEURS
const User = require('../models/User')

//*--------------------------------------------------------------------------------
//*----------------------- FONCTION CONNECTION UTILISATEUR ------------------------
//*--------------------------------------------------------------------------------

//* FONCTION pour CREER un nouvel utilisateur
async function signup(req, res) {
  try {
    // console.log("SignUp request", req.body)
    // console.log('res', res.send);
    const {email, password} = req.body
    const hashedPassword = await hashPassword(password)
    // console.log("password:", password)
    // console.log('hashedPassword', hashedPassword)
    const user = new User({ email, password: hashedPassword })
    await user.save()
    res.status(201).send({ message: "Utilisateur enrengistré !" })
  } catch (error) {
  res.status(409).send({ message: "Utilisateur non enrengistré !" + error })  
  }
}

//* FONCTION pour HASHER le MDP 10 fois avec BCRYPT
function hashPassword(password) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds) 
}

//* FONCTION pour CONNECTER un utilisateur existant
async function login(req, res) {
  try {
    const {email, password} = req.body
    const user = await User.findOne({ email: email })
    const isPasswordOk = await bcrypt.compare(password, user.password)
    if (!isPasswordOk) {
      res.status(403).send({ message: 'Mot de passe incorrect'})
    } else {
      const token = createToken(user)
      res.status(200).send({ userId: user?._id, token: token})
    }
    // console.log('user', user)
    // console.log('isPasswordOk', isPasswordOk)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Erreur interne" })
  }
}

//* FONCTION pour CREER un TOKEN qui EXPIRE après 24h
function createToken(user) {
  const jwtToken = process.env.JWT_TOKEN
  return jwt.sign({ email: user.email, userId: user._id }, jwtToken, { expiresIn: "24h" })
}

//* EXPORT DONNEES
module.exports = { signup, login }

