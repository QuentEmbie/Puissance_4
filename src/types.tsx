import { ContextFrom, EventFrom } from "xstate";
import { p4Machine, GameModel } from "./machine";

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

export type GameContext = ContextFrom<typeof GameModel>;
export type GameEvents = EventFrom<typeof GameModel>;
export type GameEvent<T extends GameEvents["type"]> = GameEvents & { type: T };
export type GameGuard<T extends GameEvents["type"]> = (context: GameContext, event: GameEvent<T>) => boolean;
export type GameAction<T extends GameEvents["type"]> = (context: GameContext, event: GameEvent<T>) => Partial<GameContext>;
