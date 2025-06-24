//* CLOUDINARY CONFIGUE
const Sauce = require("../models/Sauce");
const fs = require("fs");
const isProd = process.env.NODE_ENV === "production";

// GET ALL
function getAllSauces(req, res, next) {
  Sauce.find({})
    .then((sauces) => res.send(sauces))
    .catch((error) => res.status(400).json({ error }));
}

// GET ONE
function getOneSauce(req, res, next) {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.send(sauce))
    .catch((error) => res.status(400).json({ error }));
}

// CREATE
function createSauce(req, res, next) {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject.userId;

  const imageUrl = isProd
    ? req.file.path
    : `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
}

// MODIFY
function modifySauce(req, res, next) {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: isProd
          ? req.file.path
          : `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete sauceObject.userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        return res.status(401).json({ message: "Non-autorisé" });
      }

      // Suppression de l'ancienne image uniquement en local
      if (!isProd && req.file) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) console.error("Erreur suppression image :", err);
        });
      }

      return Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      ).then(() => res.status(200).json({ message: "Sauce modifiée !" }));
    })
    .catch((error) => res.status(400).json({ error }));
}

// DELETE
function deleteSauce(req, res, next) {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        return res.status(401).json({ message: "Non-autorisé" });
      }

      // Suppression image en local uniquement
      if (!isProd) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) console.error("Erreur suppression image :", err);
        });
      }

      return Sauce.deleteOne({ _id: req.params.id }).then(() =>
        res.status(200).json({ message: "Sauce supprimée !" })
      );
    })
    .catch((error) => res.status(500).json({ error }));
}

// LIKE / DISLIKE
function likeDislikeSauce(req, res, next) {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;

  if (like === 1) {
    return Sauce.updateOne(
      { _id: sauceId },
      { $push: { usersLiked: userId }, $inc: { likes: 1 } }
    )
      .then(() => res.status(200).json({ message: "1 like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  if (like === -1) {
    return Sauce.updateOne(
      { _id: sauceId },
      { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } }
    )
      .then(() => res.status(200).json({ message: "1 dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  if (like === 0) {
    return Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          return Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          ).then(() => res.status(200).json({ message: "-1 like" }));
        }

        if (sauce.usersDisliked.includes(userId)) {
          return Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          ).then(() => res.status(200).json({ message: "-1 dislike" }));
        }

        return res.status(200).json({ message: "Aucun changement" });
      })
      .catch((error) => res.status(404).json({ error }));
  }
}

module.exports = {
  createSauce,
  getAllSauces,
  getOneSauce,
  modifySauce,
  deleteSauce,
  likeDislikeSauce,
};

//* SCHOOL PROJECT
// const Sauce = require("../models/Sauce");
// const fs = require("fs"); // Supprime les images

// // AFFICHER TOUTES LES SAUCES DE LA DATABASE AVEC LA METHODE ".find"
// function getAllSauces(req, res, next) {
//   Sauce.find({})
//     .then((sauces) => res.send(sauces))
//     .catch((error) => res.status(400).json({ error }));
// }

// // AFFICHER UNE SAUCE DE LA DATABASE SELECTIONNEE AVEC LA METHODE ".findOne"
// function getOneSauce(req, res, next) {
//   Sauce.findOne({ _id: req.params.id })
//     .then((sauce) => res.send(sauce))
//     .catch((error) => res.status(400).json({ error }));
// }

// // CREER UNE SAUCE DANS LA DATABASE
// function createSauce(req, res, next) {
//   // PARSER L'OBJET DE LA REQUETE
//   const sauceObject = JSON.parse(req.body.sauce);
//   delete sauceObject.userId;

//   const sauce = new Sauce({
//     ...sauceObject,
//     // RECUPERE "userId" DEPUIS LE TOKEN D'AUTHENTIFICATION
//     userId: req.auth.userId,
//     imageUrl: `${req.protocol}://${req.get("host")}/images/${
//       req.file.filename
//     }`,
//     likes: 0,
//     dislikes: 0,
//     usersLiked: [],
//     usersDisliked: [],
//   });
//   sauce
//     .save()
//     .then(() => res.status(201).json({ message: "Sauce enrengistrée" }))
//     .catch((error) => res.status(400).json(error));
// }

// // MODIFIER UNE SAUCE AVEC LA METHODE ".updateOne"
// function modifySauce(req, res, next) {
//   // VERIFIER S'IL Y A UN OBJET DANS NOTRE REQUETE "req.file"
//   const sauceObject = req.file
//     ? {
//         // PARSE L'OBJET DE LA REQUETE
//         ...JSON.parse(req.body.sauce),
//         // CREER L'URL DE L'IMAGE
//         imageUrl: `${req.protocol}://${req.get("host")}/images/${
//           req.file.filename
//         }`,
//         // ENSUITE RECUPERER LES DONNEES A MODIFIER "...req.body"
//       }
//     : { ...req.body };
//   // SUPPRIMER LE CHAMP "userId" DE LA REQUETE
//   delete sauceObject.userId;
//   // CHERCHER L'OBJET DANS LA DATABASE
//   Sauce.findOne({ _id: req.params.id })
//     // VERIFIER QUE L'UTILISATEUR EST LE PROPRIETAIRE DE L'OBJET A MODIFIER
//     .then((sauce) => {
//       // SI "userId" DE LA DATABASE EST != DE "userId" DE LA REQUETE
//       if (sauce.userId != req.auth.userId) {
//         // ANNULER LA REQUETE ET RENVOI UN MSG "Non-autorisé"
//         res.status(401).json({ message: "Non-autorisé" });
//         // SI IL EST LE PROPRIETAIRE
//       } else {
//         // SI L'UTILISATEUR CHANGE L'IMAGE, SUPPRIMER L'ANCIENNE
//         if (req.file) {
//           const filename = sauce.imageUrl.split("/images/")[1];
//           fs.unlink(`images/${filename}`, () => {});
//         }
//         // ECRASER LES ANCIENNES DONNEES PAR LES NOUVELLES => "sauceObject"
//         Sauce.updateOne(
//           { _id: req.params.id },
//           { ...sauceObject, _id: req.params.id }
//         )
//           .then(() => res.status(200).json({ message: " Sauce modifiée! " }))
//           .catch((error) => res.status(401).json({ error }));
//       }
//     })
//     .catch((error) => res.status(400).json({ error }));
// }

// // SUPPRIMER UNE SAUCE AVEC LA METHODE ".deleteOne"
// function deleteSauce(req, res, next) {
//   // CHERCHER L'OBJET DANS LA DATABASE
//   Sauce.findOne({ _id: req.params.id })
//     // VERIFIER QUE L'UTILISATEUR EST LE PROPRIETAIRE DE L'OBJET A SUPPRIMER
//     .then((sauce) => {
//       // SI "userId" DE LA DATABASE EST != DE "userId" DE LA REQUETE
//       if (sauce.userId != req.auth.userId) {
//         // ANNULER LA REQUETE ET RENVOI UN MSG "Non-autorisé"
//         res.status(401).json({ message: "Non-autorisé" });
//       } else {
//         // SINON CHERCHER LE NOM DE L'IMAGE A SUPPRIMER AVEC "split"
//         const filename = sauce.imageUrl.split("images/")[1];
//         // UTILISER FS POUR SUPPRIMER L'IMAGE
//         fs.unlink(`images/${filename}`, () => {
//           // CALLBACK POUR SUPPRIMER LA SAUCE DE LA DATABASE
//           Sauce.deleteOne({ _id: req.params.id })
//             .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
//             .catch((error) => res.status(400).json({ error }));
//         });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ error });
//     });
// }

// // LIKE OU DISLIKE UNE SAUCE
// function likeDislikeSauce(req, res, next) {
//   const like = req.body.like;
//   const userId = req.body.userId;
//   const sauceId = req.params.id;

//   // +1 like
//   if (like === 1) {
//     // MODIFIER LA SAUCE DE LA REQUETE
//     Sauce.updateOne(
//       { _id: sauceId },
//       {
//         // AJOUTER "userId" DANS LE TABLEAU DES UTILISATEURS QUI ONT LIKE
//         $push: { usersLiked: userId },
//         // AJOUTER "+1" SUR LE NOMBRE TOTAL DE LIKE
//         $inc: { likes: +1 },
//       }
//     )
//       .then(() => res.status(200).json({ message: "1 like ajouté !" }))
//       .catch((error) => res.status(400).json({ error }));
//   }

//   // +1 dislike
//   if (like === -1) {
//     // MODIFIER LA SAUCE DE LA REQUETE
//     Sauce.updateOne(
//       { _id: sauceId },
//       {
//         // AJOUTER "userId" DANS LE TABLEAU DES UTILISATEURS QUI ONT DISLIKE
//         $push: { usersDisliked: userId },
//         // AJOUTER "+1" SUR LE NOMBRE TOTAL DE DISLIKE
//         $inc: { dislikes: +1 },
//       }
//     )
//       .then(() => {
//         res.status(200).json({ message: "1 dislike ajouté !" });
//       })
//       .catch((error) => res.status(400).json({ error }));
//   }

//   // 0 like OU  0 dislike
//   if (like === 0) {
//     // CHERCHER LA SAUCE A MODIFIER
//     Sauce.findOne({ _id: sauceId })
//       .then((sauce) => {
//         // SI L'UTILISATEUR A LIKE UNE SAUCE =>
//         if (sauce.usersLiked.includes(userId)) {
//           // MODIFIER LA SAUCE DE LA REQUETE
//           Sauce.updateOne(
//             { _id: sauceId },
//             {
//               // RETIRER "userId" DU TABLEAU DES UTILISATEURS QUI ONT LIKE
//               $pull: { usersLiked: userId },
//               // RETIRER "+1" SUR LE NOMBRE TOTAL DE LIKE
//               $inc: { likes: -1 },
//             }
//           )
//             .then(() => res.status(200).json({ message: "-1 like" }))
//             .catch((error) => res.status(400).json({ error }));
//         }
//         // SI L'UTILISATEUR A DISLIKE UNE SAUCE =>
//         if (sauce.usersDisliked.includes(userId)) {
//           // MODIFIER LA SAUCE DE LA REQUETE
//           Sauce.updateOne(
//             { _id: sauceId },
//             {
//               // RETIRER "userId" DU TABLEAU DES UTILISATEURS QUI ONT DISLIKE
//               $pull: { usersDisliked: userId },
//               // RETIRER "+1" SUR LE NOMBRE TOTAL DE DISLIKE
//               $inc: { dislikes: -1 },
//             }
//           )
//             .then(() => res.status(200).json({ message: "-1 dislike" }))
//             .catch((error) => res.status(400).json({ error }));
//         }
//       })
//       .catch((error) => res.status(404).json({ error }));
//   }
// }

// // EXPORTER LES FONCTIONS "...Sauce"
// module.exports = {
//   createSauce,
//   getAllSauces,
//   getOneSauce,
//   modifySauce,
//   deleteSauce,
//   likeDislikeSauce,
// };
