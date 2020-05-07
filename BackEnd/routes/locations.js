const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const { Location } = require("../models/location");

//ALL LOCATIONS
router.get("/all", async (req, res) => {
  try {
    const locations = await Location.find();
    if (!locations) return res.status(404).send({ message: "No Location Yet" });
    res.json({ count: locations.length, data: locations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//LOGIN USER LOCATION
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(400).send({ message: "No User Login" });
    const location = await Location.findOne({ userId: user.id });
    if (!location) return res.status(404).send({ message: "No Location Yet" });
    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//ADDING & UPDATING USER LOCATION
router.post("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(400).send({ message: "No User Login" });
    let location = await Location.findOne({ userId: user.id });
    if (location) {
      location.location.coordinates = req.body.location.coordinates;
      location.timestamp = new Date().getTime();
      await location.save();
      return res.json(location);
    }

    location = new Location({
      userId: user.id,
      location: req.body.location,
    });
    await location.save();
    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
