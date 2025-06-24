import { useState, useEffect } from "react";
import { User } from "../types";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  const signin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return {
    user,
    signin,
    signout,
    updateUser,
  };
};
