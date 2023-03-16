import { GameAction } from "./types";
import { currentColor, findLowestInColumn } from "./utils";

export const addPlayerAction: GameAction<"ADD_PLAYER"> = (context, event) => {
  console.log(event);
  context.players[event.playerNumber] = event.name;
  return { players: context.players };
};

export const playAction: GameAction<"PLAY_MOVE"> = (context, event) => {
  context.grid[findLowestInColumn(context.grid, event.j)][event.j] = currentColor(context);
  context.currentPlayer = context.currentPlayer === 0 ? 1 : 0;
  return context;
};

export const playWinningMoveAction: GameAction<"PLAY_MOVE"> = (context, event) => {
  context.grid[findLowestInColumn(context.grid, event.j)][event.j] = currentColor(context);
  return context;
};

export const cleanContextAction: GameAction<"RESTART"> = (context, event) => {
  context.grid = [
    ["v", "v", "v", "v", "v", "v", "v", "v"],
    ["v", "v", "v", "v", "v", "v", "v", "v"],
    ["v", "v", "v", "v", "v", "v", "v", "v"],
    ["v", "v", "v", "v", "v", "v", "v", "v"],
    ["v", "v", "v", "v", "v", "v", "v", "v"],
    ["v", "v", "v", "v", "v", "v", "v", "v"],
    ["v", "v", "v", "v", "v", "v", "v", "v"],
  ];
  context.players = ["", ""];
  return context;
};
