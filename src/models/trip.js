const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600
    },
    estimatedCost: {
      type: Number,
      min: 0,
      default: 0
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    placeDetails: {
      type: String,
      trim: true
    },
    mapsSearchQuery: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ["food", "sightseeing", "culture", "adventure", "shopping", "travel", "rest"],
      default: "sightseeing"
    },
    editSource: {
      type: String,
      enum: ["ai", "user"],
      default: "ai"
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
      min: 1
    },
    date: Date,
    theme: {
      type: String,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 800
    },
    activities: [activitySchema]
  },
  {
    timestamps: true
  }
);

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    pricePerNight: {
      type: Number,
      min: 0,
      default: 0
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    area: {
      type: String,
      trim: true
    },
    nearbyLandmark: {
      type: String,
      trim: true
    },
    whyRecommended: {
      type: String,
      trim: true,
      maxlength: 500
    },
    bookingSearchQuery: {
      type: String,
      trim: true
    },
    confidence: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium"
    },
    isShortlisted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const budgetSchema = new mongoose.Schema(
  {
    accommodation: {
      type: Number,
      min: 0,
      default: 0
    },
    food: {
      type: Number,
      min: 0,
      default: 0
    },
    transport: {
      type: Number,
      min: 0,
      default: 0
    },
    activities: {
      type: Number,
      min: 0,
      default: 0
    },
    miscellaneous: {
      type: Number,
      min: 0,
      default: 0
    },
    total: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    _id: false
  }
);

const editHistorySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["created", "generated", "activity_added", "activity_updated", "activity_deleted", "budget_updated", "hotels_updated"],
      required: true
    },
    summary: {
      type: String,
      trim: true
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    destination: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },

    startDate: {
      type: Date
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (endDate) {
          return !this.startDate || !endDate || endDate >= this.startDate;
        },
        message: "End date must be after start date"
      }
    },

    travelers: {
      type: Number,
      min: 1,
      max: 20,
      default: 1
    },

    preferences: [String],

    budgetLevel: {
      type: String,
      enum: ["budget", "mid-range", "luxury"],
      default: "mid-range"
    },

    currency: {
      type: String,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
      default: "USD"
    },

    status: {
      type: String,
      enum: ["draft", "generated", "editing", "completed"],
      default: "draft"
    },

    budget: budgetSchema,

    hotels: [hotelSchema],

    itinerary: [itineraryDaySchema],

    editHistory: [editHistorySchema],

    aiMetadata: {
      provider: String,
      model: String,
      generatedAt: Date
    }
  },
  {
    timestamps: true
  }
);

tripSchema.index({ user: 1, createdAt: -1 });
tripSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Trip", tripSchema);
