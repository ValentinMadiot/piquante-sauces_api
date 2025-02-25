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
//*---------------------------- CONTROLLER UTILISATEUR ----------------------------
//*--------------------------------------------------------------------------------

//* CREER UN NOUVEL UTILISATEUR
function signup (req, res, next) {
  //* HASHER LE PASSWORD 10 FOIS AVEC BYCRYPT
  bcrypt.hash(req.body.password, 10)
    //* TRANSMETTRE LE MAIL ET MDP A UN OBJET UTILISATEUR
    .then(hash => {
      //* CREER UN NOUVEL UTILISATEUR
      const user = new User({
      //* EMAIL DE LA REQUÊTE
      email: req.body.email,
      //* MDP HASHER
      password: hash
      })
      //* SAUVEGARDE DANS LA DATABASE AVEC LA METHODE ".save"
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(501).json({ error }))
}

//?--------------------------------------------------------------------------------

//* CONNECTER UN UTILISATEUR EXISTANT
function login (req, res, next) {
  //* CHERCHER EMAIL DE L'UTILISATERUR DANS LA DATABASE AVEC LA METHODE ".findOne"
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user === null) {
        //* SI AUCUNE CORRESPONDANCE, ECHEC DE CONNEXION ET ON RENVOI UN MSG
        res.status(401).json({ message: 'L’adresse e-mail que vous avez saisie n’est associée à aucun compte' })
      } else {
        //* SINON ON COMPARE LE MDP DONNEES AVEC CELUI DE LA DATABASE AVEC LA METHODE ".compare" DE BYCRYPT
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              //* SI IL EST INVALIDE, ECHEC DE LA CONNEXION (401)
              res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' })
            } else {
              //* SINON IL EST VALIDE, POURSUIT LA CONNEXION (201) 
              res.status(200).json({
                userId: user._id,
                //* ENVOI UN TOKEN D'AUTHENTIFICATION AVEC LA METHODE ".sign" DE JASONWEBTOKEN
                token: jwt.sign(
                  //* ARGUMENTS : userId, token dans ".env", durée de validité
                  { userId: user._id },
                  process.env.JWT_TOKEN,
                  { expiresIn: '24h' }
                )
              })
            }
          })
          .catch(error => res.status(500).json({ error }))
      }
    })
    .catch(error => res.status(501).json({ error }))
}

//* EXPORT DONNEES
module.exports = { signup, login }