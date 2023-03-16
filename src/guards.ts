import { GameContext, GameEvents, GameGuard } from "./types";
import { currentColor, findLowestInColumn, isWinningMove } from "./utils";

export const column_valid: GameGuard<"PLAY_MOVE"> = (context, event) => {
  return findLowestInColumn(context.grid, event.j) >= 0;
};

export const is_winning_move: GameGuard<"PLAY_MOVE"> = (context, event) => {
  return isWinningMove(context.grid, event.j, currentColor(context));
};

export const are_two_players: GameGuard<"START"> = (context) => {
  return context.players.filter((playerName) => playerName !== "").length === 2;
};

export const less_or_equal_to_two_players: GameGuard<"START"> = (context, event) => {
  return context.players.filter((playerName) => playerName !== "").length <= 2;
};
