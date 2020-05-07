const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");
const morgon = require("morgan");
const bearerToken = require("express-bearer-token");
const app = express();

const users = require("./routes/users");
const images = require("./routes/images");

if (!config.get("mongodbServerLink")) {
  console.error("FATAL ERROR: mongodbServerLink is not defined");
  process.exit(1);
}
const mongoURI = config.get("mongodbServerLink");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("mongoDB connected..."))
  .catch((err) => console.log("Could not connect to MongoDB...  :" + err));

app.use(cors());
app.use(morgon("dev"));
app.use(express.json());
app.use(bearerToken());

app.use("/api/users", users);
app.use("/api/images", images);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
