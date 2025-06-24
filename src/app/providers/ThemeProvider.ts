"use client";

import { useEffect, useState } from "react";
import { useUser } from "./UserProvider";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";

    if (user) return user.preferences?.theme as "light" | "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark" || user?.preferences?.theme === "dark"
    );
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, preferences: { theme } })
      );
    }
  }, [theme, user]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!user) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [user]);

  return children;
}
