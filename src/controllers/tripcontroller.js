const Trip = require("../models/trip");


const useMockAI = process.env.USE_MOCK_AI === "true";

const generateTripPlan = useMockAI
  ? require("../services/aimock.services")
  : require("../services/ai.services").generateTripPlan;

const createTrip = async (req, res, next) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      travelers,
      preferences
    } = req.body;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Destination is required"
      });
    }

    const trip = await Trip.create({
      user: req.user._id,
      destination,
      startDate,
      endDate,
      travelers,
      preferences
    });

    return res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trip deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};


const generateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    const generatedPlan = await generateTripPlan(trip);

    trip.budget = generatedPlan.budget;
    trip.hotels = generatedPlan.hotels;
    trip.itinerary = generatedPlan.itinerary;
    trip.status = "generated";

    await trip.save();

    return res.status(200).json({
      success: true,
      message: "Trip plan generated successfully",
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  generateTrip
};
