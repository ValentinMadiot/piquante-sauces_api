const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);

// services/database.js
const mongoose = require("mongoose");

const login = process.env.MONGODB_LOGIN;
const password = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://${login}:${password}@user.rbdox.mongodb.net/?retryWrites=true&w=majority&appName=user`;

if (!login || !password) {
  console.error("❌ Erreur : MONGODB_LOGIN & MONGODB_PASSWORD non définis.");
  process.exit(1);
}

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connexion MongoDB réussie !"))
  .catch((err) => console.error("❌ Connexion MongoDB échouée !", err));

module.exports = mongoose;
