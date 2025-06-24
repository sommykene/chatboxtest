export const getOnboardingDataPrompt = {
  name: "get_onboarding_data",
  description: "Find out users country preferences",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      favoriteCountry: {
        type: "string",
        description: "Favourite country",
      },
      favoriteContinent: {
        type: "string",
        description: "Favourite continent",
      },
      favoriteDestination: {
        type: "string",
        description: "Favourite destination",
      },
    },
    additionalProperties: false,
    required: ["favoriteCountry", "favoriteContinent", "favoriteDestination"],
  },
};
