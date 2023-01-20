import "./index.css";
import { assign, createMachine, interpret } from "xstate";
import { useMachine } from "@xstate/react";
import clsx from "clsx";
import { PIECE, Piece } from "./types";
import { Grid } from "./components/grid";
import { GetDerivedStateFromProps } from "react";

export const promiseMachine = createMachine(
  {
    schema: {
      context: {} as { players?: string[]; grid: Piece[][]; currentPlayer: Piece },
      events: {} as { type: "NEW_PLAYER" } | { type: "PLAY_MOVE" } | { type: "PLAY_WINNING_MOVE" } | { type: "RESTART" },
    },
    id: "promise",
    initial: "play",
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
      currentPlayer: "r",
    },
    states: {
      waiting: {
        on: {
          NEW_PLAYER: { target: "play" },
        },
      },
      play: {
        on: {
          PLAY_WINNING_MOVE: { target: "end", actions: ["play_winning_move"], cond: "is_winning_move" },
          PLAY_MOVE: { target: "play", actions: ["play"], cond: "column_valid" },
        },
      },
      end: {
        on: {
          RESTART: { target: "waiting" },
        },
      },
    },
  },
  {
    actions: {
      play: assign((context, event) => {
        context.grid[findLowestInColumn(context.grid, event.j)][event.j] = context.currentPlayer;
        context.currentPlayer = context.currentPlayer === PIECE.ROUGE ? PIECE.JAUNE : PIECE.ROUGE;
        return context;
      }),
      play_winning_move: assign((context, event) => {
        context.grid[findLowestInColumn(context.grid, event.j)][event.j] = context.currentPlayer;
        context.currentPlayer = context.currentPlayer === PIECE.ROUGE ? PIECE.JAUNE : PIECE.ROUGE;
        return context;
      }),
    },
    guards: {
      column_valid: (context, event) => {
        return findLowestInColumn(context.grid, event.j) >= 0;
      },
      is_winning_move: (context, event) => {
        return isWinningMove(context.grid, event.j, context.currentPlayer);
      },
    },
  }
);

const findLowestInColumn = (grid: Piece[][], j: number) => {
  console.log("findLowestInColumn: ", j);
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i][j] === PIECE.VIDE) {
      return i;
    }
  }
  return -1;
};

const isWinningMove = (grid: Piece[][], j: number, color: Piece) => {
  const i = findLowestInColumn(grid, j);
  console.log("isWinningMove: ", i, j);
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

const isInsideGrid = (grid: Piece[][], i: number, j: number) => {
  return 0 <= i && i < grid.length && 0 <= j && j < grid[0].length;
};

function App() {
  const [state, send] = useMachine(promiseMachine);
  console.log(state);
  return (
    <div className="flex flex-col gap-10 items-center">
      <h1 className="text-black text-lg">Puissance 4</h1>

      <div className="flex gap-8">
        <button onClick={() => send("NEW_PLAYER")}>new player</button>
        <button onClick={() => send("PLAY_MOVE")}>play_move</button>
        <button onClick={() => send("RESTART")}>restart</button>
      </div>
      <div className="flex space-x-3">
        <p>Current player: </p>
        <div
          className={clsx("rounded-full h-6 w-6 col-span-1", state.context.currentPlayer === "j" ? "bg-yellow-300" : "bg-red-300")}
        ></div>
      </div>
      <Grid grid={state.context.grid} />
    </div>
  );
}

export default App;
