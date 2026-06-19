// src/models/Trip.js

const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  time: String,
  title: String,
  description: String,
  estimatedCost: Number,
  location: String
});

const itineraryDaySchema = new mongoose.Schema({
  dayNumber: Number,
  theme: String,
  activities: [activitySchema]
});

const hotelSchema = new mongoose.Schema({
  name: String,
  address: String,
  pricePerNight: Number,
  rating: Number
});

const budgetSchema = new mongoose.Schema({
  accommodation: Number,
  food: Number,
  transport: Number,
  activities: Number,
  miscellaneous: Number,
  total: Number
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    destination: {
      type: String,
      required: true
    },

    startDate: Date,
    endDate: Date,

    travelers: Number,

    preferences: [String],

    status: {
      type: String,
      enum: ["draft", "generated", "completed"],
      default: "draft"
    },

    budget: budgetSchema,

    hotels: [hotelSchema],

    itinerary: [itineraryDaySchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Trip", tripSchema);