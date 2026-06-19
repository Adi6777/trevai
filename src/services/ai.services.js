const buildItineraryPrompt = require("../prompts/itinerary.prompt");
const validateItinerary = require("../validators/itinerary.validator");

const extractJson = (text) => {
  const cleaned = text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("AI response did not contain JSON");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
};

const getGeminiResponseText = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const message =
      data.error?.message || "Gemini request failed";
    throw new Error(message);
  }

  const parts =
    data.candidates?.[0]?.content?.parts || [];

  const text = parts
    .map((part) => part.text)
    .filter(Boolean)
    .join("");

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
};

const generateTripPlan = async (tripData) => {
  try {
    const prompt = buildItineraryPrompt(tripData);
    const rawResponse = await getGeminiResponseText(prompt);
    const parsedResponse = JSON.parse(extractJson(rawResponse));

    return validateItinerary(parsedResponse);
  } catch (error) {
    throw new Error(`Failed to generate itinerary: ${error.message}`);
  }
};

module.exports = {
  generateTripPlan
};
