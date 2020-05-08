const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const locationSchema = new mongoose.Schema({
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      index: "2dsphere",
    },
  },
  timestamp: {
    type: Date,
    required: true,
    default: new Date().valueOf(),
  },
});

const Location = mongoose.model("UserLocation", locationSchema);

exports.Location = Location;
exports.locationSchema = locationSchema;
