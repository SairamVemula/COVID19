const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const config = require("config");
const auth = require("../middleware/auth");
const { User } = require("../models/user");

const mongoURI = config.get("mongodbServerLink");

const conn = mongoose.createConnection(mongoURI);

//Initialize gfs
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("profilePics");
});

//Create Storage Engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "profilePics",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

//Upload Image
router.post("/upload", [auth, upload.single("profile")], async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(400).send({ message: "No User Login" });
  if (user.picId !== "none") {
    gfs.remove({ _id: user.picId, root: "profilePics" }, function (
      err,
      gridStore
    ) {
      if (err) return handleError(err);
      console.log("success");
    });
  }
  user.picId = req.file.id;
  user.photoUrl = "" + config.get("serverUrl") + "/api/images/profile/" + req.file.filename;
  await user.save();
  res.json({ message: "Successfully Uploaded", fileInfo: req.file });
});

//Getting Profice Picture
router.get("/profile/:fileName", async (req, res) => {
  gfs.files.findOne({ filename: req.params.fileName }, (err, file) => {
    if (!file || file.length === 0)
      return res.status(400).json({ err: "no files exists" });
    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png" ||
      file.contentType === "image/jpg"
    ) {
      var readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({ err: "Not Found" });
    }
  });
});

// Deleting a Profile
router.delete("/delete", auth, async (req, res) => {
  let user = await User.findById(req.user.sub);
  if (!user) return res.status(400).send({ message: "No User Login" });
  if (user.picId !== "none") {
    gfs.remove({ _id: user.picId, root: "profilePics" }, function (
      err,
      gridStore
    ) {
      if (err) return handleError(err);
    });
  }
  user.picId = "none";
  user.photoUrl = "";
  await user.save();
  res.send({ message: "Profile Picture Deleted Successfully" });
});

module.exports = router;
