"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import { user1, user2, user3 } from "../mocks";

type UserContextType = {
  user: User | null;
  signin: (userId: string) => void;
  signout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify([user1, user2, user3]));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const signin = (userId: string) => {
    const users = JSON.parse(localStorage.getItem("users") ?? "[]") as User[];
    const userData = users.find((user) => user.id === userId) as User;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const signout = () => {
    const storedUser = localStorage.getItem("user");
    const users = JSON.parse(localStorage.getItem("users") ?? "[]") as User[];

    if (storedUser) {
      const updatedUser = JSON.parse(storedUser);
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }

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

  return (
    <UserContext.Provider value={{ user, signin, signout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
