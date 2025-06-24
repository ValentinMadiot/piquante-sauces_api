//* CLOUDINARY CONFIGUE
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const isProd = process.env.NODE_ENV === "production";

let storage;

if (isProd) {
  // Configuration Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "piquante-sauces",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
  });
} else {
  // Stockage Local en Dev
  const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
  };

  storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "images");
    },
    filename: (req, file, callback) => {
      const extension = MIME_TYPES[file.mimetype] || "jpg";
      callback(null, `${file.fieldname}_${Date.now()}.${extension}`);
    },
  });
}

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Seuls les fichiers image (jpg, jpeg, png, webp) sont autorisés"
      ),
      false
    );
  }
};

module.exports = multer({ storage, fileFilter }).single("image");

//* SCHOOL PROJECT
// const multer = require("multer");
// const path = require("path");

// const MIME_TYPES = {
//   "image/jpg": "jpg",
//   "image/jpeg": "jpeg",
//   "image/png": "png",
// };

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "images");
//   },
//   filename: (req, file, callback) => {
//     const extension = MIME_TYPES[file.mimetype] || "jpg";
//     callback(null, `${file.fieldname}_${Date.now()}.${extension}`);
//   },
// });

// module.exports = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 },
// }).single("image");
