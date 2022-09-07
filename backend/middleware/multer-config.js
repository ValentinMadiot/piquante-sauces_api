//*--------------------------------------------------------------------------------
//*---------------------------------- LIBRAIRIE -----------------------------------
//*--------------------------------------------------------------------------------

//* IMPORT MULTER
const multer = require('multer')

//*--------------------------------------------------------------------------------
//*------------------------------- MULTER - CONFIG --------------------------------
//*--------------------------------------------------------------------------------

//* TYPES D'IMAGES ACCEPTE
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png'
}

//* STOCKAGE DE L'IMAGE 
//* UTILISER LA METHODE ".diskStorage" QUI CONFIGURE LE DOSSIER DE RECEPTION ET LE NOM DU FICHIER
const storage = multer.diskStorage ({
  destination: (req, file, callback) => {
    //* CALLBACK (null = PAS D'ERREUR, "DOSSIER DE RECEPTION") 
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    //* REMPLACER LES ESPACES PAR DES UNDERSCORES DANS LE NOM DU FICHIER D'ORIGINE
    const name = file.originalname.split(' ').join('_')
    //* AJOUTER UNE EXTENSION A PARTIR DE "mimetype"
    const extension = MIME_TYPES[file.mimetype]
    //* CALLBACK (null = PAS D'ERREUR, "name" + "date à la miliseconde" + '.' + "extension") 
    callback(null, name + Date.now() + '.' + extension)
  }
})

//* EXPORT DE LA CONFIGURATION DE MULTER
//* (AJOUTER AUX ROUTES SAUCE POUR ENRENGISTRER IMAGES AU SYSTEME DE FICHHIER DU SERVEUR)
module.exports = multer({ storage }).single('image')
//* APPEL MULTER ({ notre objet storage }) AVEC LA METHODE ".single('image')" = IMAGE UNIQUE