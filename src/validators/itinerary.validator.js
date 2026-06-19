const requiredBudgetFields = [
  "accommodation",
  "food",
  "transport",
  "activities",
  "miscellaneous",
  "total"
];

const isPlainObject = (value) => {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
};

const assertNumber = (value, fieldName) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${fieldName} must be a number`);
  }
};

const assertText = (value, fieldName) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required`);
  }
};

const validateBudget = (budget) => {
  if (!isPlainObject(budget)) {
    throw new Error("Itinerary budget is required");
  }

  requiredBudgetFields.forEach((field) => {
    assertNumber(budget[field], `budget.${field}`);
  });

  const calculatedTotal =
    budget.accommodation +
    budget.food +
    budget.transport +
    budget.activities +
    budget.miscellaneous;

  if (Math.abs(calculatedTotal - budget.total) > 1) {
    throw new Error("Budget total does not match the breakdown");
  }
};

const validateHotels = (hotels) => {
  if (!Array.isArray(hotels) || hotels.length === 0) {
    throw new Error("At least one hotel suggestion is required");
  }

  hotels.forEach((hotel, index) => {
    if (!isPlainObject(hotel)) {
      throw new Error(`hotels.${index} must be an object`);
    }

    [
      "name",
      "address",
      "area",
      "nearbyLandmark",
      "whyRecommended",
      "bookingSearchQuery"
    ].forEach((field) => {
      assertText(hotel[field], `hotels.${index}.${field}`);
    });

    assertNumber(hotel.pricePerNight, `hotels.${index}.pricePerNight`);
    assertNumber(hotel.rating, `hotels.${index}.rating`);

    if (
      hotel.confidence &&
      !["high", "medium", "low"].includes(hotel.confidence)
    ) {
      throw new Error(`hotels.${index}.confidence is invalid`);
    }
  });
};

const validateItineraryDays = (itinerary) => {
  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    throw new Error("At least one itinerary day is required");
  }

  itinerary.forEach((day, dayIndex) => {
    if (!isPlainObject(day)) {
      throw new Error(`itinerary.${dayIndex} must be an object`);
    }

    assertNumber(day.dayNumber, `itinerary.${dayIndex}.dayNumber`);

    if (!day.theme) {
      throw new Error(`itinerary.${dayIndex}.theme is required`);
    }

    if (!Array.isArray(day.activities) || day.activities.length === 0) {
      throw new Error(`itinerary.${dayIndex}.activities is required`);
    }

    day.activities.forEach((activity, activityIndex) => {
      if (!isPlainObject(activity)) {
        throw new Error(
          `itinerary.${dayIndex}.activities.${activityIndex} must be an object`
        );
      }

      const requiredTextFields = [
        "time",
        "title",
        "description",
        "location",
        "placeDetails",
        "mapsSearchQuery"
      ];

      requiredTextFields.forEach((field) => {
        assertText(
          activity[field],
          `itinerary.${dayIndex}.activities.${activityIndex}.${field}`
        );
      });

      assertNumber(
        activity.estimatedCost,
        `itinerary.${dayIndex}.activities.${activityIndex}.estimatedCost`
      );
    });
  });
};

const validateItinerary = (plan) => {
  if (!isPlainObject(plan)) {
    throw new Error("AI response must be a JSON object");
  }

  validateBudget(plan.budget);
  validateHotels(plan.hotels);
  validateItineraryDays(plan.itinerary);

  return plan;
};

module.exports = validateItinerary;
