import { createMachine, assign } from "xstate";
import { createModel } from "xstate/lib/model";
import { addPlayerAction, cleanGridAction, playAction, playWinningMoveAction } from "./actions";
import { are_two_players, column_valid, is_winning_move, less_than_two_players } from "./guards";
import { GameContext, GameEvent, PIECE, Piece, STATE } from "./types";
import { currentColor, findLowestInColumn, isWinningMove } from "./utils";

export const GameModel = createModel(
  {
    grid: [
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "j", "r", "v", "v", "v", "v"],
    ] as Piece[][],
    currentPlayer: 0,
    players: ["john", "greg"],
    colors: [PIECE.JAUNE, PIECE.ROUGE],
  },
  {
    events: {
      START: () => ({}),
      ADD_PLAYER: (name: string, playerNumber: number) => ({ name, playerNumber }),
      PLAY_MOVE: (j: number) => ({ j }),
      RESTART: () => ({}),
    },
  }
);

export const p4Machine = GameModel.createMachine({
  id: "promise",
  initial: STATE.WAITING,
  context: GameModel.initialContext,
  states: {
    WAITING: {
      entry: [GameModel.assign(cleanGridAction)],
      on: {
        START: { target: STATE.PLAY, cond: are_two_players },
        ADD_PLAYER: { cond: less_than_two_players, target: STATE.WAITING, actions: [GameModel.assign(addPlayerAction)] },
      },
    },
    PLAY: {
      on: {
        PLAY_MOVE: [
          { cond: is_winning_move, actions: [GameModel.assign(playWinningMoveAction)], target: STATE.END },
          { cond: column_valid, actions: [GameModel.assign(playAction)], target: STATE.PLAY },
        ],
      },
    },
    END: {
      on: {
        RESTART: { target: STATE.WAITING },
      },
    },
  },
});
