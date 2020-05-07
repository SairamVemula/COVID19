const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

// const schemaContact = new mongoose.Schema({
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//   },
// });
// const Contact = mongoose.model("Contact", schemaContact);

const schemaUser = new mongoose.Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
    required: true,
  },
  oAuthId: {
    type: String,
  },
  name: {
    type: String,
    maxlength: 255,
  },
  email: {
    type: String,
    maxlength: 255,
  },
  password: {
    type: String,
    maxlength: 255,
  },
  picId: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
  isDoctor: {
    type: Boolean,
  },
  visited: {
    type: [Object],
  },
  isInfected: {
    type: String,
    enum: ["infected", "cured", "no-infection"],
    default: "no-infection",
    required: true,
  },
});

schemaUser.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      sub: this.id,
      iat: new Date().getTime(),
      // exp: new Date().setDate(new Date() + 1),
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", schemaUser);

function validateRegister(user) {
  const schema = {
    name: Joi.string().required().min(5).max(255),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(255),
    isDoctor: Joi.boolean().required(),
  };
  return Joi.validate(user, schema);
}
function validateLogin(user) {
  const schema = {
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(255),
  };
  return Joi.validate(user, schema);
}

exports.schemaUser = schemaUser;
exports.User = User;
// exports.schemaContact = schemaContact;
// exports.Contact = Contact;
exports.validateRegister = validateRegister;
exports.validateLogin = validateLogin;
