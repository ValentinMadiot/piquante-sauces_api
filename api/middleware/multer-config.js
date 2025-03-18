const multer = require("multer");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype] || "jpg";
    callback(null, `${file.fieldname}_${Date.now()}.${extension}`);
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");
