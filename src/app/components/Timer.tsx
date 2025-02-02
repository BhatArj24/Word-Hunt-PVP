import React, { FC } from 'react';

interface TimerProps {
    timeLeft: number;
}

export const Timer: FC<TimerProps> = ({ timeLeft }) => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');

    return (
        <div className="px-12 py-8 text-5xl font-semibold text-white">
            <h1>{minutes}:{seconds}</h1>
        </div>
    );
}; 