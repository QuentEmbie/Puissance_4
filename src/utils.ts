import { PIECE, Piece } from "./types";

export const isWinningMove = (grid: Piece[][], j: number, color: Piece) => {
  const i = findLowestInColumn(grid, j);

  const directions = [
    { i: 1, j: 0 },
    { i: 0, j: 1 },
    { i: 1, j: 1 },
    { i: 1, j: -1 },
  ];
  for (const dir of directions) {
    let newI = i - dir.i;
    let newJ = j - dir.j;
    let acc = 1;
    while (isInsideGrid(grid, newI, newJ) && grid[newI][newJ] === color) {
      newI = newI - dir.i;
      newJ = newJ - dir.j;
      acc++;
    }
    newI = i + dir.i;
    newJ = j + dir.j;
    while (isInsideGrid(grid, newI, newJ) && grid[newI][newJ] === color) {
      newI = newI + dir.i;
      newJ = newJ + dir.j;
      acc++;
    }
    if (4 <= acc) {
      return true;
    }
  }
  return false;
};

export const isInsideGrid = (grid: Piece[][], i: number, j: number) => {
  return 0 <= i && i < grid.length && 0 <= j && j < grid[0].length;
};

export const findLowestInColumn = (grid: Piece[][], j: number) => {
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i][j] === PIECE.VIDE) {
      return i;
    }
  }
  return -1;
};
