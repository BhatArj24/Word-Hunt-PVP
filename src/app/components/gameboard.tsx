"use client"
import React, { FC, useState, useRef, useEffect } from "react";
import axios from "axios";

interface Letter {
  letter: string;
  row: number;
  col: number;
}

const GameBoard: FC = () => {
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


  useEffect(() => {
    setBoard(generateBoard());
  }, []);

  function generateBoard(): string[][] {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * letters.length)])
    );
  }

  function handleMouseDown(letter: string, row: number, col: number) {
    setDragging(true);
    setStartSelection({ letter, row, col });
    setSelectedLetters([{ letter, row, col }]);
    triggerCellAnimation(row, col); // Trigger cell animation on selection
  }

  function handleMouseMove(letter: string, row: number, col: number) {
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

  function handleMouseUp() {
    setDragging(false);
    const word = selectedLetters.map(({ letter }) => letter).join("");
    if (word) {
      scoreWord(word);
    }
    resetSelection();  // Reset selection after validation
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
    }, 300); // Duration of the animation
  };

  const resetGame = () => {
    setBoard(generateBoard());
    resetSelection();
    setPoints(0);
  }

  return (
    <div>

        <div className="flex items-center justify-between">
            <div
                    className={`px-12 font-semibold py-8 text-6xl mb-6 text-white transition-all duration-300 ${
                    animatePoints ? 'scale-110 text-green-400' : 'text-white'
                    }`}
                >
                    {points}
            </div>
            <div className="px-12 py-8 text-5xl font-semibold">
                <h1>1:00</h1>
            </div>
        </div>

        
        <div className="flex flex-col items-center justify-center mt-4">
        {/* Score display */}
        <div className="flex flex-col items-center mb-16">
            {
                animateWord ? (
                    <h1 className={`text-4xl mt-6 font-bold text-white transition-all duration-300 ${
                        animatePoints ? 'scale-110 text-green-400' : 'text-white'
                        }`}>{word}</h1>
                ) :
                (
                    <p className={`text-4xl mt-6 font-bold text-white transition-all duration-300 ${
                      animatePoints ? 'scale-110 text-green-400' : 'text-white'
                      }`}>
            {selectedLetters.map(({ letter }) => letter).join("") || "----"}
            </p>
                )

            }
            
        </div>
        <div
            ref={boardRef}
            className="grid grid-cols-5 gap-2 mb-4 user-select-none"
            onMouseUp={handleMouseUp}
        >
            {board.map((row, rowIndex) =>
            row.map((letter, colIndex) => {
                const isSelected = selectedLetters.some(
                (selected) => selected.row === rowIndex && selected.col === colIndex
                );

                const isPartOfValidWord =
                isValid && isSelected; // Only highlight selected cells green if the word is valid.

                return (
                <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-20 h-20 text-white text-2xl font-bold flex items-center justify-center rounded cursor-pointer border border-white transition-all ${
                    isPartOfValidWord
                        ? "bg-green-300" // Highlight green if part of a valid word.
                        : isSelected
                        ? "bg-yellow-300" // Highlight yellow if just selected.
                        : "bg-black" // Default background.
                    } ${cellAnimation.get(`${rowIndex}-${colIndex}`) ? "transform scale-110 transition-all" : ""}`} // Animation on cell selection
                    onMouseDown={() => handleMouseDown(letter, rowIndex, colIndex)}
                    onMouseMove={() => handleMouseMove(letter, rowIndex, colIndex)}
                >
                    {letter}
                </div>
                );
            })
            )}
            </div>
            <button className="px-16 py-4 rounded-full bg-white text-black font-bold mt-8" onClick={resetGame}>Reset</button>
        </div>
    </div>
  );
};

export default GameBoard;