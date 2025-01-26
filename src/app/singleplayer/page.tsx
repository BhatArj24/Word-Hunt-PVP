import Link from "next/link";
import { FC } from "react";
import Navbar from "../components/navbar";
import GameBoard from "../components/gameboard";

const SinglePlayer: FC = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="">

        <GameBoard />
      </div>
    </div>
  );
};

export default SinglePlayer;