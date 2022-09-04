//*--------------------------------------------------------------------------------
//*---------------------------------- LIBRAIRIE -----------------------------------
//*--------------------------------------------------------------------------------

//* IMPORT JSONWEBTOKEN
const jwt = require('jsonwebtoken')

//*--------------------------------------------------------------------------------
//*---------------------- FONCTION POUR VERIFIER UTILISATEUR ----------------------
//*--------------------------------------------------------------------------------

module.exports = (req, res, next) => {
  const header = req.header('Authorization')
  if (header == null) return res.status(403).send({ message : "Invalid" })

  const token = req.headers.authorization.split(" ")[1]
  
  if (token == null) return res.status(403).send({ message: "Token Invalid"})

  jwt.verify(token, process.env.JWT_TOKEN, (err, modif) => {
    if (err) return res.status(403).send({ message: "Token invalid " + err })
    // console.log("Le token est bien validé, on continue")
    next()
  })
}