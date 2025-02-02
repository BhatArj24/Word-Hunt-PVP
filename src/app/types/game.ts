export interface Letter {
    letter: string;
    row: number;
    col: number;
}

export interface BoardProps {
    onWordValidated?: (word: string) => void;
    onPointsUpdated?: (points: number) => void;
} 