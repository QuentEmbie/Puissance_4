import { ContextFrom, EventFrom } from "xstate";
import { p4Machine } from "./machine";

export const PIECE = {
  VIDE: "v",
  JAUNE: "j",
  ROUGE: "r",
} as const;

export type Piece = typeof PIECE[keyof typeof PIECE];

export type Player = {
  color: Piece;
  name: String;
};

export const STATE = {
  WAITING: "WAITING",
  PLAY: "PLAY",
  END: "END",
} as const;

export type State = typeof STATE[keyof typeof STATE];

export type GameContext = ContextFrom<typeof p4Machine>;
export type GameEvent = EventFrom<typeof p4Machine>;
