import React, { FC } from "react";

interface BoardCellProps {
    letter: string;
    rowIndex: number;
    colIndex: number;
    isSelected: boolean;
    isValid: boolean | null;
    hasAnimation: boolean;
    onMouseDown: () => void;
    onMouseMove: () => void;
}

export const BoardCell: FC<BoardCellProps> = ({
    letter,
    isSelected,
    isValid,
    hasAnimation,
    onMouseDown,
    onMouseMove,
}) => {
    const isPartOfValidWord = isValid && isSelected;

    return (
        <div
            className={`w-20 h-20 text-white text-2xl font-bold flex items-center justify-center rounded cursor-pointer border border-white transition-all ${isPartOfValidWord
                ? "bg-green-300"
                : isSelected
                    ? "bg-yellow-300"
                    : "bg-black"
                } ${hasAnimation ? "transform scale-110 transition-all" : ""}`}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
        >
            {letter}
        </div>
    );
}; 