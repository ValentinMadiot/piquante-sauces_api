//*--------------------------------------------------------------------------------
//*------------------------- LIBRAIRIE + FICHIER IMPORTE --------------------------
//*--------------------------------------------------------------------------------

//* IMPORT DES MODELE DE SAUCE
const Sauce = require('../models/Sauce')

//* IMPORT JSONWEBTOKEN
const jwt = require('jsonwebtoken')

//* APPEL/IMPORT DE FS (SUPPRIMER LES IMAGES EN LOCAL)
const fs = require('fs')

//*--------------------------------------------------------------------------------
//*-------------------------------- FONCTION SAUCE --------------------------------
//*--------------------------------------------------------------------------------

//* AFFICHER TOUTES LES SAUCES AVEC LA METHODE .FIND
function getAllSauces(req, res, next) {
  // console.log('Token validé, nous sommes dans getAllSauces')
  // Sauce.deleteMany({}).then(console.log())
  Sauce.find({})
    .then(sauces => res.send(sauces))
    .catch(error => res.status(400).json({ error }))
}

//* AFFICHE UNE SAUCE SELECTIONNEE AVEC LA METHODE .FINDONE
function getOneSauce(req, res, next) {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => res.send(sauce))
    .catch(error => res.status(400).json({ error }))
}

//* CREER UNE SAUCE
function createSauce(req, res, next) {
  const body = req.body.sauce
  // console.log({ body })
  
  const sauceObj = JSON.parse(body)
  // console.log({ sauceObj })
  
  // ON SUPPRIME l'userId DE LA REQUETE
  delete sauceObj.userId
  
  // ON RECUPERE LE TOKEN ET ON LE DECODE
  const token = req.headers.authorization.split(" ")[1]
  const decodedUser = jwt.verify(token, process.env.JWT_TOKEN)
  // console.log("JWT", decodedUser)
  // console.log("AUTH", req.headers.authorization)
  const sauce = new Sauce ({
    ...sauceObj,
    
    // ON RECUPERE LE TOKEN DE L'UTILISATEUR QU'ON A DECODE
    userId: decodedUser.userId,
    
    // ON CREER L'URL DE L'IMAGE POUR L'AFFICHER
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    
    // ON DECLARE O POUR LES LIKE ET DISLIKE
    likes: 0,
    dislikes: 0,
    
    // ON CREER UN TABLEAU VIDE ETANT DONNEES QUE PERSONNE A ENCORE LIKE ET DISLIKE
    usersLiked: [],
    usersDisliked: []
  })

  sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enrengistrée" }))
    .catch((error) => res.status(400).json( error ))
}

//* MODIFIER UNE SAUCE AVEC LA METHODE .UPDATEONE
function modifySauce(req, res, next) {
  // const token = req.headers.authorization.split(" ")[1]
  // const decodedUser = jwt.verify(token, process.env.JWT_TOKEN)
  const sauceObjet = req.file ? {

    ...JSON.parse(req.body.sauce),
  
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  
  } : {...req.body}

  // console.log(sauceObjet)

  delete sauceObjet.userId

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // if(sauce.userId != decodedUser) {
      //   res.status(401).json({ message: "Non autorisé "})
      // } else {
      //   Sauce.updateOne({ _id: req.params.id}, {...sauceObjet, _id: req.params.id})
      //   .then(() => res.status(200).json({message : ' Sauce modifié! '}))
      //   .catch(error => res.status(401).json({ error }))
      // }
      Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }))
}

//* SUPPRIMER UNE SAUCE AVEC LA METHODE .DELETEONE
function deleteSauce(req, res, next) {
  // const token = req.headers.authorization.split(" ")[1]
  // const decodedUser = jwt.verify(token, process.env.JWT_TOKEN)
  Sauce.findOne({ _id: req.params.id })

  .then (sauce => {
    // if (sauce.userId != decodedUser) {
    //   res.status(401).json({ message: 'Non-autorisé' })
    // } else {
    //   const filename = sauce.imageUrl.split('images/')[1];
    //   fs.unlink(`images/${filename}`, () => {
    //     Sauce.deleteOne({ _id: req.params.id })
    //     .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
    //     .catch(error => res.status(400).json({ error }));
    //   })
    // }
    const filename = sauce.imageUrl.split('images/')[1];

    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
      .catch(error => res.status(400).json({ error }));
    })
  })
  .catch(error => {res.status(500).json({ error })})
}


//* LIKE OU DISLIKE UNE SAUCE
function likeDislikeSauce(req, res, next) {
  
  const like = req.body.like
  const userId = req.body.userId
  const sauceId = req.params.id
 
  //* AJOUT 1 like
  if (like === 1) { 
    Sauce.updateOne({ _id: sauceId }, {
      $push: { usersLiked: userId },
      $inc: { likes: +1 }
      })
      .then(() => res.status(200).json({ message: '1 like ajouté !' }))
      .catch((error) => res.status(400).json({ error }))
  }

  //* If 1 dislike
  if (like === -1) {
    Sauce.updateOne({ _id: sauceId }, {
      $push: { usersDisliked: userId },
      $inc: { dislikes: +1 }
      })
      .then(() => { res.status(200).json({ message: '1 dislike ajouté !' })})
      .catch((error) => res.status(400).json({ error }))
  }
  
  //* MAJ like OU dislike
  if (like === 0) {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { 
          Sauce.updateOne({ _id: sauceId }, {
            $pull: { usersLiked: userId },
            $inc: { likes: -1 }
            })
            .then(() => res.status(200).json({ message: '-1 like' }))
            .catch((error) => res.status(400).json({ error }))
        }
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne({ _id: sauceId }, {
            $pull: { usersDisliked: userId },
            $inc: { dislikes: -1 }
            })
            .then(() => res.status(200).json({ message: '-1 dislike' }))
            .catch((error) => res.status(400).json({ error }))
        }
      })
      .catch((error) => res.status(404).json({ error }))
  }
} 

//* EXPORT LES FONCTIONS SAUCES
module.exports = {createSauce, getAllSauces, getOneSauce, modifySauce, deleteSauce, likeDislikeSauce}