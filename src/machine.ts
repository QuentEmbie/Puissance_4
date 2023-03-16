import { createModel } from "xstate/lib/model";
import { addPlayerAction, cleanContextAction, playAction, playWinningMoveAction } from "./actions";
import { are_two_players, column_valid, is_winning_move, less_or_equal_to_two_players } from "./guards";
import { PIECE, Piece, STATE } from "./types";

export const GameModel = createModel(
  {
    grid: [
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "v", "v", "v", "v", "v", "v"],
      ["v", "v", "v", "v", "v", "v", "v", "v"],
    ] as Piece[][],
    currentPlayer: 0,
    players: ["", ""],
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
      on: {
        START: { target: STATE.PLAY, cond: are_two_players },
        ADD_PLAYER: { cond: less_or_equal_to_two_players, target: STATE.WAITING, actions: [GameModel.assign(addPlayerAction)] },
        RESTART: { target: STATE.WAITING, actions: [GameModel.assign(cleanContextAction)] },
      },
    },
    PLAY: {
      on: {
        PLAY_MOVE: [
          { cond: is_winning_move, actions: [GameModel.assign(playWinningMoveAction)], target: STATE.END },
          { cond: column_valid, actions: [GameModel.assign(playAction)], target: STATE.PLAY },
        ],
        RESTART: { target: STATE.WAITING, actions: [GameModel.assign(cleanContextAction)] },
      },
    },
    END: {
      on: {
        RESTART: { target: STATE.WAITING, actions: [GameModel.assign(cleanContextAction)] },
      },
    },
  },
});
