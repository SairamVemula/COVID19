const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/user");

module.exports = async function (req, res, next) {
  const token = req.token;
  if (!token)
    return res.status(401).json({ message: "Access Denied No Token Provied" });
  try {
    const user = jwt.verify(token, config.get("jwtPrivateKey"));
    if (!user) return res.status(403).json("No User");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token \n" + err });
  }
};
