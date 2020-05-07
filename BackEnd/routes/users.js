const express = require("express");
const router = express.Router();
// const router = require("express-promise-router")();
const { User, validateLogin, validateRegister } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth");

//REGISTER
router.post("/register", async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No Body" });

  const { error } = validateRegister(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({ message: "Email is already registered..." });

  // user = await User.findOne({ "local.mobile": req.body.mobile });
  // if (user)
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Mobile no is already registered..." });

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isDoctor: req.body.isDoctor,
    picId: "none",
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.json({
    message: "Login Successfull",
    data: _.pick(user, ["_id", "name", "email"]),
  });
});
//LOGIN
router.post("/login", async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No Body" });

  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ message: "Invalid Email or Password" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .json({ success: false, message: "Invalid Email or Password" });

  const token = user.generateAuthToken();
  res.json({ message: "Login Successful", authToken: token });
});

//GOOGLE OAUTH2
router.post("/googleLogin", async (req, res) => {
  if (!req.body)
    return res.status(400).json({ success: false, message: "No Body" });
  // console.log(req.body.id);
  let user = await User.findOne({ oAuthId: req.body.id });

  if (user) {
    const token = user.generateAuthToken();
    return res.json({
      message: "Login Successful",
      authToken: token,
    });
  }

  user = new User({
    method: "google",
    oAuthId: req.body.id,
    email: req.body.email,
    name: req.body.name,
    photoUrl: req.body.photoUrl,
  });
  await user.save();
  const token = user.generateAuthToken();
  return res.json({
    message: "Login Successful",
    authToken: token,
  });
});

//FACEBOOK OAUTH20

router.post("/facebookLogin", async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No Body" });
  let user = await User.findOne({ oAuthId: req.body.id });

  if (user) {
    const token = user.generateAuthToken();
    return res.json({
      message: "Login Successful",
      authToken: token,
    });
  }

  user = new User({
    method: "facebook",
    oAuthId: req.bod.id,
    email: req.body.email,
    name: req.body.name,
    photoUrl: req.body.photoUrl,
  });
  await user.save();
  const token = user.generateAuthToken();
  return res.json({
    message: "Login Successful",
    authToken: token,
  });
});
router.post("/contact", auth, async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(400).send({ message: "No User Login" });
  const contact = {
    id: req.body.id,
    timestamp: new Date().getTime(),
  };
  // await contact.save();
  user.visited.push(contact);
  await user.save();
  res.json(user);
});

module.exports = router;
