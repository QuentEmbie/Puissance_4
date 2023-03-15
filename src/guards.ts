import { GameContext, GameEvents, GameGuard } from "./types";
import { currentColor, findLowestInColumn, isWinningMove } from "./utils";

export const column_valid: GameGuard<"PLAY_MOVE"> = (context, event) => {
  return findLowestInColumn(context.grid, event.j) >= 0;
};

export const is_winning_move: GameGuard<"PLAY_MOVE"> = (context, event) => {
  return isWinningMove(context.grid, event.j, currentColor(context));
};

// TODO handle these two guards
export const are_two_players: GameGuard<"START"> = (context, event) => {
  return context.players.length === 2;
};

export const less_than_two_players: GameGuard<"START"> = (context, event) => {
  return context.players.length === 2;
};
