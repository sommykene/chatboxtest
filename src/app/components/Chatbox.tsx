"use client";
import { useEffect, useRef, useState } from "react";
import { useChatbot } from "../hooks/useChatbot";

export default function Chatbox() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage } = useChatbot();

  useEffect(() => {
    endRef.current?.scrollIntoView();
  }, [messages]);

  async function send() {
    if (!input.trim()) return;
    const userInput = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);

    const reply = await sendMessage(userInput);
    if (!reply) return;
    setIsLoading(false);

    setMessages((prev) => [
      ...prev.slice(0, -1),
      { role: "assistant", content: reply },
    ]);
  }

  return (
    <div
      className={`bottom-6 right-6 flex flex-1 flex-col rounded-lg shadow-lg border bg-white/40  `}>
      <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div
              key={i}
              className={`flex ${
                isUser ? "justify-end" : "justify-start"
              } gap-2`}>
              <div
                className={`max-w-[70%] p-2 rounded-lg ${
                  isUser
                    ? "bg-accent text-white"
                    : "bg-accent/10 dark:bg-gray-700 dark:text-white"
                }`}>
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <div className="p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 rounded-md border px-2 py-1 text-sm bg-transparent outline-none"
          placeholder="Type a message"
        />
        <button
          onClick={send}
          className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
}
