const buildItineraryPrompt = (tripData) => {
    return `
You are an expert travel planner.

Generate ONLY valid JSON.

Do not include markdown.
Do not include explanations.
Do not include triple backticks.

Destination: ${tripData.destination}
Days: ${tripData.days}
Travelers: ${tripData.travelers}
Budget: ${tripData.budgetType}

Preferences:
${tripData.preferences.join(", ")}

JSON Structure:

{
  "hotelSuggestions": [],
  "budgetBreakdown": {},
  "itinerary": []
}

Requirements:

- Each itinerary day must contain:
  - dayNumber
  - activities

- Each activity must contain:
  - time
  - title
  - description
  - location
  - estimatedCost

- Suggest 3 hotels.

- Include realistic costs.

- Budget breakdown totals must match.

Respond with JSON only.
`;
};

module.exports = buildItineraryPrompt;