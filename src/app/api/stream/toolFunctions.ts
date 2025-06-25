// These were for assistant generation and tool calls.

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

export const changeThemePrompt = {
  name: "change_theme",
  description: "Change the theme of the application",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      theme: {
        type: "string",
        enum: ["light", "dark"],
        description: "Theme to change to",
      },
    },
    additionalProperties: false,
    required: ["theme"],
  },
};
