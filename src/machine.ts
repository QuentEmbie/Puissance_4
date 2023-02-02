import { createMachine, assign } from "xstate";
import { PIECE, Piece, STATE } from "./types";
import { currentColor, findLowestInColumn, isWinningMove } from "./utils";

export const p4Machine = createMachine(
  {
    tsTypes: {} as import("./machine.typegen").Typegen0,
    schema: {
      context: {} as { grid: Piece[][]; currentPlayer: 0 | 1; players: String[]; colors: Piece[] },
      events: {} as
        | { type: "START" }
        | { type: "PLAY_MOVE"; j: number }
        | { type: "END" }
        | { type: "RESTART" }
        | { type: "ADD_PLAYER"; name: String; playerNumber: number },
    },
    id: "promise",
    initial: STATE.WAITING,
    context: {
      grid: [
        ["v", "v", "v", "v", "v", "v", "v", "v"],
        ["v", "v", "v", "v", "v", "v", "v", "v"],
        ["v", "v", "v", "v", "v", "v", "v", "v"],
        ["v", "v", "v", "v", "v", "v", "v", "v"],
        ["v", "v", "v", "v", "v", "v", "v", "v"],
        ["v", "v", "v", "v", "v", "v", "v", "v"],
        ["v", "v", "j", "r", "v", "v", "v", "v"],
      ],
      currentPlayer: 0,
      players: ["john", "greg"],
      colors: [PIECE.JAUNE, PIECE.ROUGE],
    },
    states: {
      WAITING: {
        entry: ["cleanGrid"],
        on: {
          START: { target: STATE.PLAY, cond: "are_two_players" },
          ADD_PLAYER: { cond: "less_than_two_players", target: STATE.WAITING, actions: ["add_player"] },
        },
      },
      PLAY: {
        on: {
          PLAY_MOVE: [
            { cond: "is_winning_move", actions: ["play_winning_move"], target: STATE.END },
            { cond: "column_valid", actions: ["play"], target: STATE.PLAY },
          ],
          END: { target: STATE.END },
        },
      },
      END: {
        on: {
          RESTART: { target: STATE.WAITING },
        },
      },
    },
  },
  {
    actions: {
      play: assign((context, event) => {
        context.grid[findLowestInColumn(context.grid, event.j)][event.j] = currentColor(context);
        context.currentPlayer = context.currentPlayer === 0 ? 1 : 0;
        return context;
      }),
      play_winning_move: assign((context, event) => {
        context.grid[findLowestInColumn(context.grid, event.j)][event.j] = currentColor(context);
        return context;
      }),
      add_player: assign((context, event) => {
        context.players[event.playerNumber] = event.name;
        return context;
      }),
      cleanGrid: assign((context) => {
        context.grid = [
          ["v", "v", "v", "v", "v", "v", "v", "v"],
          ["v", "v", "v", "v", "v", "v", "v", "v"],
          ["v", "v", "v", "v", "v", "v", "v", "v"],
          ["v", "v", "v", "v", "v", "v", "v", "v"],
          ["v", "v", "v", "v", "v", "v", "v", "v"],
          ["v", "v", "v", "v", "v", "v", "v", "v"],
          ["v", "v", "v", "v", "v", "v", "v", "v"],
        ];
        return context;
      }),
    },
    guards: {
      column_valid: (context, event) => {
        return findLowestInColumn(context.grid, event.j) >= 0;
      },
      is_winning_move: (context, event) => {
        return isWinningMove(context.grid, event.j, currentColor(context));
      },
      are_two_players: (context) => {
        return context.players.length === 2;
      },
      less_than_two_players: (context) => {
        return context.players.length < 2;
      },
    },
  }
);
