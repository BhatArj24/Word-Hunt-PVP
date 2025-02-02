import Link from "next/link";
import { FC } from "react";

const Home: FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-black">WordHunt</h1>
      <div className="flex gap-4">
        <Link href="/singleplayer">
          <button className="py-4 px-12 bg-black rounded-full font-bold">
            Single Player
          </button>
        </Link>
        <Link href="/multiplayer">
          <button className="py-4 px-12 bg-black rounded-full font-bold">
            Multiplayer
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;