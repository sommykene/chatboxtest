"use client";

import Chatbox from "../components/Chatbox";
import ThemeToggle from "../components/ThemeToggle";
import { upperCaseFirstLetter } from "../helpers";
import { useUser } from "../providers/UserProvider";
import { Welcome } from "./Welcome";

export default function Home() {
  const { user, signout } = useUser();

  if (!user) {
    return <Welcome />;
  }

  return (
    <div className="flex p-10 h-screen gap-8 max-w-6xl mx-auto ">
      <div className="flex flex-1 justify-between flex-col h-auto w-full">
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Hello {user.name} 👋🏾</h1>
          <p className="italic font-xs whitespace-pre-line text-primary">{`I can help with world geography-related questions.
          I can help with setting or updating your favourites
          I can help update your theme`}</p>

          <div>
            <ThemeToggle />
            {user.favoriteCountry && (
              <p>
                Favourite country: {upperCaseFirstLetter(user.favoriteCountry)}
              </p>
            )}
            {user.favoriteContinent && (
              <p>
                Favourite continent:{" "}
                {upperCaseFirstLetter(user.favoriteContinent)}
              </p>
            )}
            {user.favoriteDestination && (
              <p>
                Favourite destination:{" "}
                {upperCaseFirstLetter(user.favoriteDestination)}
              </p>
            )}
          </div>
        </div>
        <button className="button" onClick={() => signout()}>
          Sign Out
        </button>
      </div>
      <Chatbox />
    </div>
  );
}
