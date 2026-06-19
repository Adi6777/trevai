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

const buildItineraryPrompt = (tripData) => {
  const days = getTripDays(tripData.startDate, tripData.endDate);
  const travelers = tripData.travelers || 1;
  const preferences =
    tripData.preferences && tripData.preferences.length > 0
      ? tripData.preferences.join(", ")
      : "local food, sightseeing, culture";

  return `
You are Trao's senior travel planning agent.

Create a practical travel plan that feels locally aware, realistic, and easy to edit later.
Return ONLY valid JSON. Do not include markdown, explanations, or code fences.

Trip details:
- Destination: ${tripData.destination}
- Number of days: ${days}
- Travelers: ${travelers}
- Preferences: ${preferences}

The JSON must match this exact shape:

{
  "budget": {
    "accommodation": 0,
    "food": 0,
    "transport": 0,
    "activities": 0,
    "miscellaneous": 0,
    "total": 0
  },
  "hotels": [
    {
      "name": "",
      "address": "",
      "pricePerNight": 0,
      "rating": 0
    }
  ],
  "itinerary": [
    {
      "dayNumber": 1,
      "theme": "",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "",
          "description": "",
          "estimatedCost": 0,
          "location": ""
        }
      ]
    }
  ]
}

Rules:
- Create exactly ${days} itinerary days.
- Each day should have 3 to 5 activities.
- Suggest exactly 3 hotels.
- Use numbers for all costs and ratings.
- Budget total must equal accommodation + food + transport + activities + miscellaneous.
- Avoid generic filler like "visit popular places"; use specific, useful activity titles.
- Keep descriptions short enough for a mobile itinerary card.
`;
};

module.exports = buildItineraryPrompt;
