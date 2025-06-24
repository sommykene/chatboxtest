"use client";
import { useEffect, useState } from "react";
import { useUser } from "../providers/UserProvider";
import "./toggle.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user } = useUser();

  useEffect(() => {
    const current = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setTheme(current);
  }, []);

  useEffect(() => {
    if (user) {
      const userTheme = user.preferences?.theme || "light";
      setTheme(userTheme);
    }
  }, [user]);

  const toggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        preferences: { theme: newTheme },
      })
    );
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm">Theme:</p>
      <p>☀️</p>
      <label className="switch">
        <input type="checkbox" onChange={toggle} checked={theme === "dark"} />
        <span className="slider round"></span>
      </label>
      <p>🌙</p>
    </div>
  );
}
