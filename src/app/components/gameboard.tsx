"use client"
import React, { FC, useState, useRef, useEffect } from "react";
import axios from "axios";
import { Letter, BoardProps } from "../types/game";
import { generateBoard } from "../utils/gameUtils";
import { ScoreDisplay } from "./ScoreDisplay";
import { BoardCell } from "./BoardCell";
import { Timer } from './Timer';

const GameBoard: FC<BoardProps> = ({ onWordValidated, onPointsUpdated }) => {
  const [board, setBoard] = useState<string[][]>([]);
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [word, setWord] = useState<string>();
  const [dragging, setDragging] = useState(false);
  const [startSelection, setStartSelection] = useState<Letter | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [animatePoints, setAnimatePoints] = useState(false);
  const [animateWord, setAnimateWord] = useState(false);
  const [selectedCellAnimation, setSelectedCellAnimation] = useState(false);
  const [cellAnimation, setCellAnimation] = useState<Map<string, boolean>>(new Map());
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setBoard(generateBoard());
  }, []);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive]);

  function handleMouseDown(letter: string, row: number, col: number) {
    if (!isGameActive || timeLeft === 0) return;
    setDragging(true);
    setStartSelection({ letter, row, col });
    setSelectedLetters([{ letter, row, col }]);
    triggerCellAnimation(row, col);
  }

  function handleMouseMove(letter: string, row: number, col: number) {
    if (!isGameActive || timeLeft === 0) return;
    if (dragging) {
      const lastSelected = selectedLetters[selectedLetters.length - 1];

      if (
        lastSelected &&
        Math.abs(lastSelected.row - row) <= 1 &&
        Math.abs(lastSelected.col - col) <= 1 &&
        !selectedLetters.some((selected) => selected.row === row && selected.col === col)
      ) {
        const newSelectedLetters = [...selectedLetters, { letter, row, col }];
        setSelectedLetters(newSelectedLetters);

        const word = newSelectedLetters.map(({ letter }) => letter).join("");

        if (word.length > 2 && !usedWords.has(word)) {
          validateWord(word);
        } else if (word.length === 1) {
          setIsValid(false);
        } else if (word.length === 2) {
          setIsValid(false);
        }
        triggerCellAnimation(row, col);
      }
    }
  }

  async function handleMouseUp() {
    if (!isGameActive || timeLeft === 0) return;
    if (!dragging) return;
    setDragging(false);

    const word = selectedLetters.map(({ letter }) => letter).join("");
    if (word) {
      scoreWord(word);
    }
    resetSelection();
  }

  function resetSelection() {
    setSelectedLetters([]);
    setSelectedCellAnimation(false); // Reset selection animation
  }

  function scoreWord(word: string) {
    if (isValid) {
      if (!usedWords.has(word)) {
        const newPoints = points + 100 * (2 ** (word.length - 1));
        setPoints(newPoints);

        // Trigger point animation
        setAnimatePoints(true);
        setAnimateWord(true);
        setWord(word);
        setTimeout(() => {
          setAnimatePoints(false);
          setAnimateWord(false);
          setWord("");
        }, 500); // Reset animation after 0.5s

        // Use setter to update usedWords and trigger re-render
        setUsedWords((prevUsedWords) => new Set(prevUsedWords.add(word)));
      }
    }
    setIsValid(false);
  }

  const validateWord = async (word: string) => {
    if (!word) return;
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
    const options = {
      method: 'GET',
      url: `https://wordsapiv1.p.rapidapi.com/words/${word}`,
      headers: {
        'x-rapidapi-key': apiKey, // Use a public env variable for client-side
        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);

      if (response.status === 200) {
        setIsValid(true);
        console.log('Valid word:', word);
      } else {
        setIsValid(false);
        console.log('Invalid word:', word);
      }
    } catch (error) {
      setIsValid(false);
      console.log('Invalid Word');
    }
  };

  const triggerCellAnimation = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    setCellAnimation((prev) => new Map(prev).set(cellKey, true));
    setTimeout(() => {
      setCellAnimation((prev) => new Map(prev).set(cellKey, false));
    }, 300);
  };

  const startGame = () => {
    setTimeLeft(60);
    setIsGameActive(true);
    setPoints(0);
    setBoard(generateBoard());
    resetSelection();
  };

  const resetGame = () => {
    setBoard(generateBoard());
    resetSelection();
    setPoints(0);
    setTimeLeft(60);
    setIsGameActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className={`px-12 font-semibold py-8 text-6xl mb-6 text-white transition-all duration-300 ${animatePoints ? 'scale-110 text-green-400' : 'text-white'
          }`}>
          {points}
        </div>
        <Timer timeLeft={timeLeft} />
      </div>

      {timeLeft === 0 && (
        <div className="text-center text-2xl text-white mb-4">
          Game Over! Final Score: {points}
        </div>
      )}

      <div className="flex flex-col items-center justify-center mt-4">
        <ScoreDisplay
          points={points}
          animatePoints={animatePoints}
          word={word}
          animateWord={animateWord}
          selectedLetters={selectedLetters}
        />

        <div
          ref={boardRef}
          className="grid grid-cols-5 gap-2 mb-4 user-select-none"
          onMouseUp={handleMouseUp}
        >
          {board.map((row, rowIndex) =>
            row.map((letter, colIndex) => (
              <BoardCell
                key={`${rowIndex}-${colIndex}`}
                letter={letter}
                rowIndex={rowIndex}
                colIndex={colIndex}
                isSelected={selectedLetters.some(
                  (selected) => selected.row === rowIndex && selected.col === colIndex
                )}
                isValid={isValid}
                hasAnimation={cellAnimation.get(`${rowIndex}-${colIndex}`) || false}
                onMouseDown={() => handleMouseDown(letter, rowIndex, colIndex)}
                onMouseMove={() => handleMouseMove(letter, rowIndex, colIndex)}
              />
            ))
          )}
        </div>
        <div className="flex gap-4 justify-center">
          {!isGameActive && (
            <button
              className="px-16 py-4 rounded-full bg-white text-black font-bold mt-8"
              onClick={startGame}
            >
              {timeLeft === 0 ? 'Play Again' : 'Start Game'}
            </button>
          )}
          <button
            className="px-16 py-4 rounded-full bg-white text-black font-bold mt-8"
            onClick={resetGame}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;