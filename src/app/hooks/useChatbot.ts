import { useUser } from "../providers/UserProvider";

export const useChatbot = () => {
  const { updateUser, user } = useUser();

  const sendMessage = async (message: string) => {
    const res = await fetch("/api/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, threadId: user?.threadId }),
    });

    const data = await res.json();

    if (data.userTheme) {
      document.documentElement.classList.toggle(
        "dark",
        data.userTheme === "dark"
      );
    }
    updateUser({
      threadId: data.threadId,
      favoriteContinent:
        data.onboardingData?.favoriteContinent ?? user?.favoriteContinent,
      favoriteCountry:
        data.onboardingData?.favoriteCountry ?? user?.favoriteCountry,
      favoriteDestination:
        data.onboardingData?.favoriteDestination ?? user?.favoriteDestination,
      preferences: {
        theme: data.userTheme ?? user?.preferences?.theme ?? "light",
      },
    });

    return data.reply;
  };

  return {
    sendMessage,
  };
};
