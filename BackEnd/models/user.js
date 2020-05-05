const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const schemaUser = new mongoose.Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: true,
  },
  local: {
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
    isDoctor: {
      type: Boolean,
    },
    pic: {
      type: String,
    },
  },
  google: {
    googleId: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      maxlength: 255,
    },
  },
  facebook: {
    fbId: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      maxlength: 255,
    },
  },
});

schemaUser.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      sub: this.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date() + 1),
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
exports.validateRegister = validateRegister;
exports.validateLogin = validateLogin;
