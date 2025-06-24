"use client";
import { Welcome } from "./Welcome";
import Chatbox from "./components/Chatbox";
import ThemeToggle from "./components/ThemeToggle";
import { upperCaseFirstLetter } from "./helpers";
import { useUser } from "./providers/UserProvider";

export default function Home() {
  const { user, signout } = useUser();

  if (!user) {
    return <Welcome />;
  }

  return (
    <div className="flex p-10 h-screen gap-8 max-w-6xl mx-auto ">
      <div className="flex flex-1 justify-between flex-col h-auto w-full">
        <div>
          <h1 className="text-4xl font-bold">Hello {user.name} 👋🏾</h1>
          <ThemeToggle />
          {user.favoriteContinent && (
            <p>
              Favourite continent:{" "}
              {upperCaseFirstLetter(user.favoriteContinent)}
            </p>
          )}
          {user.favoriteCountry && (
            <p>
              Favourite country: {upperCaseFirstLetter(user.favoriteCountry)}
            </p>
          )}
          {user.favoriteDestination && (
            <p>
              Favourite destination:{" "}
              {upperCaseFirstLetter(user.favoriteDestination)}
            </p>
          )}
        </div>
        <button className="button" onClick={() => signout()}>
          Sign Out
        </button>
      </div>
      <Chatbox />
    </div>
  );
}
