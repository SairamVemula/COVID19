const express = require("express");
const router = express.Router();
// const router = require("express-promise-router")();
const { User, validateLogin, validateRegister } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
//REGISTER
router.post("/register", async (req, res) => {
  if (!req.body)
    return res.status(400).json({ success: false, message: "No Body" });

  const { error } = validateRegister(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  let user = await User.findOne({ "local.email": req.body.email });
  if (user)
    return res
      .status(400)
      .json({ success: false, message: "Email is already registered..." });
  user = await User.findOne({ "local.mobile": req.body.mobile });
  if (user)
    return res
      .status(400)
      .json({ success: false, message: "Mobile no is already registered..." });

  user = new User({
    method: "local",
    local: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isDoctor: req.body.isDoctor,
    },
  });
  const salt = await bcrypt.genSalt(10);
  user.local.password = await bcrypt.hash(user.local.password, salt);
  await user.save();
  res.json({
    success: true,
    message: "Login Successfull",
    data: _.pick(user.local, ["_id", "name", "email"]),
  });
});
//LOGIN
router.post("/login", async (req, res) => {
  if (!req.body)
    return res.status(400).json({ success: false, message: "No Body" });

  const { error } = validateLogin(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  user = await User.findOne({ "local.email": req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Invalid Email or Password" });

  const validPassword = await bcrypt.compare(
    req.body.password,
    user.local.password
  );
  if (!validPassword)
    return res
      .status(400)
      .json({ success: false, message: "Invalid Email or Password" });

  const token = user.generateAuthToken();
  res.json({ success: true, message: "Login Successful", sessionToken: token });
});

//GOOGLE OAUTH2
router.post("/googleLogin", async (req, res) => {
  if (!req.body)
    return res.status(400).json({ success: false, message: "No Body" });
  console.log(req.body);
  let user = await User.findOne({ "google.googleId": req.body.id });

  if (user) {
    const token = user.generateAuthToken();
    return res.json({
      success: true,
      message: "Login Successful",
      sessionToken: token,
    });
  }

  user = new User({
    method: "google",
    google: {
      googleId: req.bod.id,
      email: req.body.email,
      name: req.body.name,
    },
  });
  await user.save();
  const token = user.generateAuthToken();
  return res.json({
    success: true,
    message: "Login Successful",
    sessionToken: token,
  });
});

//FACEBOOK OAUTH20

router.post("/facebookLogin", async (req, res) => {
  if (!req.body)
    return res.status(400).json({ success: false, message: "No Body" });
  let user = await User.findOne({ "facebook.fbId": req.body.id });

  if (user) {
    const token = user.generateAuthToken();
    return res.json({
      success: true,
      message: "Login Successful",
      sessionToken: token,
    });
  }

  user = new User({
    method: "facebook",
    facebook: {
      fbId: req.bod.id,
      email: req.body.email,
      name: req.body.name,
    },
  });
  await user.save();
  const token = user.generateAuthToken();
  return res.json({
    success: true,
    message: "Login Successful",
    sessionToken: token,
  });
});
module.exports = router;
