export type User = {
  id: string;
  name: string;
  preferences: {
    theme: "light" | "dark";
  };
  favoriteCountry?: string;
  favoriteContinent?: string;
  favoriteDestination?: string;
  threadId?: string;
};
