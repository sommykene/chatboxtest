"use client";
import { useEffect, useRef, useState } from "react";
import { useChatbot } from "../hooks/useChatbot";
import "./chatbox.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chatbox() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    
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
          if (m.content === "...") {
            return (
              <div
                key={i}
                className={`flex ${
                  isUser ? "justify-end" : "justify-start"
                } gap-2`}>
                <div className={`max-w-[70%] p-2 rounded-lg bg-accent/10`}>
                  <p key="loading" className="loading">
                    .<span></span>
                  </p>
                </div>
              </div>
            );
          }
          return (
            <>
              <div
                key={i}
                className={`flex ${
                  isUser ? "justify-end" : "justify-start"
                } gap-2`}>
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    isUser ? "bg-accent text-white" : "bg-accent/10"
                  }`}>
                  {isUser ? (
                    <p>{m.content}</p>
                  ) : (
                    <Markdown remarkPlugins={[remarkGfm]}>{m.content}</Markdown>
                  )}
                </div>
              </div>
            </>
          );
        })}
        <div ref={endRef} />
      </div>
      <div className="p-3 flex gap-2">
        <input
          disabled={isLoading}
          value={input}
          ref={inputRef}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 rounded-md border px-2 py-1 text-sm bg-transparent outline-none"
          placeholder="Type a message"
        />
        <button
          disabled={isLoading}
          onClick={send}
          className="px-3 py-1 rounded-md bg-accent text-white text-sm hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Replying..." : "Send"}
        </button>
      </div>
    </div>
  );
}
