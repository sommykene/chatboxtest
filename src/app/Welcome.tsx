import { user1, user2, user3 } from "./mocks/mocks";
import { useUser } from "./hooks/useUser";

export const Welcome = () => {
  const { signin } = useUser();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to the ChatBot Extraordinaire
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        This is your personal assistant, ready to help you with anything you
        need.
      </p>
      <div className="flex gap-4">
        <button onClick={() => signin(user1)} className="button">
          Login in as {user1.name}
        </button>
        <button onClick={() => signin(user2)} className="button">
          Login in as {user2.name}
        </button>
        <button onClick={() => signin(user3)} className="button">
          Login in as {user3.name}
        </button>
      </div>
    </div>
  );
};
