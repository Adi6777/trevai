const getTripDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 3;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 3;
  }

  const differenceMs = end.getTime() - start.getTime();
  const days = Math.ceil(differenceMs / (1000 * 60 * 60 * 24)) + 1;

  return Math.min(Math.max(days, 1), 10);
};

const generateTripPlan = async (trip) => {
  const days = getTripDays(trip.startDate, trip.endDate);
  const travelers = trip.travelers || 1;
  const destination = trip.destination;
  const preferences =
    trip.preferences && trip.preferences.length > 0
      ? trip.preferences
      : ["local food", "sightseeing", "culture"];

  const itinerary = Array.from({ length: days }, (_, index) => ({
    dayNumber: index + 1,
    theme: `${destination} ${preferences[index % preferences.length]} day`,
    activities: [
      {
        time: "09:00 AM",
        title: `Explore central ${destination}`,
        description: "Start with popular landmarks and nearby local streets.",
        estimatedCost: 1200 * travelers,
        location: destination,
        placeDetails: `Use this as a flexible orientation stop around central ${destination}.`,
        mapsSearchQuery: `${destination} city center`
      },
      {
        time: "01:00 PM",
        title: "Local lunch",
        description: "Try a well-rated local restaurant based on your preferences.",
        estimatedCost: 800 * travelers,
        location: destination,
        placeDetails: "Pick a busy local restaurant with recent reviews before leaving.",
        mapsSearchQuery: `${destination} local restaurant`
      },
      {
        time: "05:00 PM",
        title: preferences[index % preferences.length],
        description: "Spend the evening on an experience matched to your trip style.",
        estimatedCost: 1500 * travelers,
        location: destination,
        placeDetails: "Keep this slot editable once the traveler picks a specific neighborhood.",
        mapsSearchQuery: `${destination} ${preferences[index % preferences.length]}`
      }
    ]
  }));

  const accommodation = 3500 * travelers * days;
  const food = 1800 * travelers * days;
  const transport = 1200 * travelers * days;
  const activities = 2500 * travelers * days;
  const miscellaneous = 1000 * travelers * days;

  return {
    budget: {
      accommodation,
      food,
      transport,
      activities,
      miscellaneous,
      total:
        accommodation +
        food +
        transport +
        activities +
        miscellaneous
    },
    hotels: [
      {
        name: `${destination} central hotel search`,
        address: `Central ${destination}`,
        pricePerNight: 3500,
        rating: 4.2,
        area: `Central ${destination}`,
        nearbyLandmark: "Main market or transit hub",
        whyRecommended: "Mock suggestion for testing the hotel card layout.",
        bookingSearchQuery: `${destination} central hotel booking`,
        confidence: "low"
      },
      {
        name: `${destination} boutique hotel search`,
        address: `Near main attractions, ${destination}`,
        pricePerNight: 5000,
        rating: 4.5,
        area: `Tourist area, ${destination}`,
        nearbyLandmark: "Major attractions area",
        whyRecommended: "Mock higher-comfort option for testing generated plans.",
        bookingSearchQuery: `${destination} boutique hotel booking`,
        confidence: "low"
      },
      {
        name: `${destination} family hotel search`,
        address: `Quiet stay area, ${destination}`,
        pricePerNight: 4200,
        rating: 4.1,
        area: `Residential or calmer area, ${destination}`,
        nearbyLandmark: "Accessible local transport",
        whyRecommended: "Mock balanced option for testing multiple hotel suggestions.",
        bookingSearchQuery: `${destination} family hotel booking`,
        confidence: "low"
      }
    ],
    itinerary
  };
};

module.exports = generateTripPlan;
