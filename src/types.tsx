export const PIECE = {
  VIDE: "v",
  JAUNE: "j",
  ROUGE: "r",
} as const;

export type Piece = typeof PIECE[keyof typeof PIECE];
