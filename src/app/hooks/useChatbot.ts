import { useUser } from "./useUser";

export const useChatbot = () => {
  const { updateUser, user } = useUser();

  const sendMessage = async (message: string) => {
    const res = await fetch("/api/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, threadId: user?.threadId }),
    });

    const data = await res.json();
    updateUser({ threadId: data.threadId });
    return data.reply; // { threadId, reply }
  };

  return {
    sendMessage,
  };
};
