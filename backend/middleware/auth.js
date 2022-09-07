//*--------------------------------------------------------------------------------
//*---------------------------------- LIBRAIRIE -----------------------------------
//*--------------------------------------------------------------------------------

//* IMPORT JSONWEBTOKEN
const jwt = require('jsonwebtoken')

//*--------------------------------------------------------------------------------
//*------------------------- AUTHENTIFICATION UTILISATEUR -------------------------
//*--------------------------------------------------------------------------------

module.exports = (req, res, next) => {
  try {
    //* RECUPERER HEADER "Authorization" ET GARDER SEULEMENT LE TOKEN GRACE A LA METHODE ".split"
    const token = req.headers.authorization.split(' ')[1]
    //* DECODER LE TOKEN AVEC LA METHODE "verify" AVEC EN ARGUMENTS (le token, clé secrète enrengistré dans .env)
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
    //* RECUPERER "userId" DU TOKEN
    const userId = decodedToken.userId
    //* AJOUTER "userId" POUR QUE NOS ROUTES PUISSENT L'UTILISER
    req.auth = {
      userId: userId
    }
    next()
  }
  catch(error) {res.status(401).json({ error })}
}
//* ENSUITE => AJOUTER "auth" AUX ROUTES Sauce AVANT CHAQUE CONTROLLER 