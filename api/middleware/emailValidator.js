const emailValidator = require("validator");

module.exports = (req, res, next) => {
  const { email } = req.body;
  if (emailValidator.isEmail(email)) {
    next();
  } else {
    return res
      .status(403)
      .json({ error: `${email} n'est pas un email valide` });
  }
};
