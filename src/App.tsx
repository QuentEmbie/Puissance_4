import "./index.css";
import { assign, createMachine, interpret } from "xstate";
import { useMachine } from "@xstate/react";
import clsx from "clsx";
import { PIECE, Piece } from "./types";
import { Grid } from "./components/grid";

export const promiseMachine = createMachine(
  {
    schema: {
      context: {} as { players?: string[]; grid: Piece[][]; currentPlayer: Piece },
      events: {} as { type: "NEW_PLAYER" } | { type: "PLAY_MOVE" } | { type: "RESTART" },
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
    },
    guards: {
      column_valid: (context, event) => {
        return findLowestInColumn(context.grid, event.j) >= 0;
      },
    },
  }
);

const findLowestInColumn = (grid: Piece[][], j: number) => {
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i][j] === PIECE.VIDE) {
      return i;
    }
  }
  return -1;
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
