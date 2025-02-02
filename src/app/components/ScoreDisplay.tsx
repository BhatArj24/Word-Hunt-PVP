import { FC } from "react";
import { Letter } from "../types/game";


interface ScoreDisplayProps {
    points: number;
    animatePoints: boolean;
    word: string | undefined;
    animateWord: boolean;
    selectedLetters: Letter[];
}

export const ScoreDisplay: FC<ScoreDisplayProps> = ({
    points,
    animatePoints,
    word,
    animateWord,
    selectedLetters
}) => {
    return (
        <div className="flex flex-col items-center mb-16">
            {animateWord ? (
                <h1 className={`text-4xl mt-6 font-bold text-white transition-all duration-300 ${animatePoints ? 'scale-110 text-green-400' : 'text-white'
                    }`}>{word}</h1>
            ) : (
                <p className={`text-4xl mt-6 font-bold text-white transition-all duration-300 ${animatePoints ? 'scale-110 text-green-400' : 'text-white'
                    }`}>
                    {selectedLetters.map(({ letter }) => letter).join("") || "----"}
                </p>
            )}
        </div>
    );
}; 