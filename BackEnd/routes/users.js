const express = require("express");
const router = express.Router();
// const router = require("express-promise-router")();
const { User, validateLogin, validateRegister } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth");
const { Location } = require("../models/location");

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

//VISTED

router.post("/contact", auth, async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(400).send({ message: "No User Login" });
  const other = await User.findById(req.body.id);
  if (!other) return res.status(400).send({ message: "No Other User" });
  const timestamp = new Date().getTime();
  const userVisit = {
    userId: req.body.id,
    timestamp: timestamp,
  };
  const otherVisit = {
    userId: req.user.sub,
    timestamp: timestamp,
  };
  // await contact.save();
  user.visited.push(userVisit);
  other.visited.push(otherVisit);
  await user.save();
  await other.save();
  res.json({ message: "Added Successfully" });
});

//GETTING AN VISTIES LIST WITH DETAILS

router.get("/visitList", auth, async (req, res) => {
  const user = await User.findById(req.user.sub).select("visited");
  if (!user) return res.status(404).json({ message: "User not Found" });
  let lists = [];
  for (const obj of user.visited) {
    const list = await User.findById(obj.userId).select(
      "name  photoUrl  email"
    );
    item = {
      _id: obj.userId,
      timestamp: obj.timestamp,
      name: list.name,
      photoUrl: list.photoUrl,
      email: list.email,
    };
    console.log(item);
    lists.push(item);
    // console.log(lists);
  }
  console.log("second");
  res.json({ message: "Successfully Got list", data: lists });
});

router.post("/setInfected",auth,async (req,res)=>{
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not Found" });
  if(!user.isDoctor) return res.status(401).json({message:"You Dont Have Permision"})

  let patient=await User.findById(req.body.id);
  if(!patient) return res.status(404).json({message:"Not record of Patient"})
  patient.infectionStatus="infected";
  let visited=patient.visited;
  if(!visited || visited.length===0) return res.status(404).json({message:"No visited list"})

  visited=visited.filter(list=> list.timestamp > new Date(Date.now() - 1209600000));
  if(!visited || visited.length===0) return res.status(404).json({message:"visited list is empty after filter last 14day visit"})

  updateVisitedMembers(visited);
  await patient.save();
  res.json({ message: "Successfully Updated infectionStatus"});
});

async function updateVisitedMembers(lists){
lists.forEach(list => {
  let user=await User.findById(list.userId);
  if(user) {
    user.infectionStatus="warning";
    await user.save();
  }
});
}
module.exports = router;
