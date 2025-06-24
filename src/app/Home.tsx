"use client";
import { Welcome } from "./Welcome";
import Chatbox from "./components/Chatbox";
import { useUser } from "./hooks/useUser";

export default function Home() {
  const { user, signout } = useUser();

  if (!user) {
    return <Welcome />;
  }

  return (
    <div className="flex p-10 min-h-screen gap-8 max-w-6xl mx-auto ">
      <div className="flex flex-1 justify-between flex-col h-auto w-full">
        <h1 className="text-4xl font-bold">Hello {user.name} 👋🏾</h1>
        <button className="button" onClick={() => signout()}>
          Sign Out
        </button>
      </div>
      <Chatbox />
    </div>
  );
}
