
export function generateBoard(): string[][] {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * letters.length)])
    );
}