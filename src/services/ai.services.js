const buildItineraryPrompt = require("../prompts/itinerary.prompt");
const validateItinerary = require("../validators/itinerary.validator");

// Gemini imports will come later

const generateTripPlan = async (tripData) => {
    try {
        const prompt = buildItineraryPrompt(tripData);

        /*
          Gemini API call here
        */

        const rawResponse = "...";

        const parsedResponse = JSON.parse(rawResponse);

        validateItinerary(parsedResponse);

        return parsedResponse;

    } catch (error) {
        throw new Error("Failed to generate itinerary");
    }
};

module.exports = {
    generateTripPlan,
};