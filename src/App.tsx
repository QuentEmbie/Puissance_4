import "./index.css";
import { assign, createMachine, interpret } from "xstate";
import { useMachine } from "@xstate/react";
import clsx from "clsx";
import { PIECE, Piece } from "./types";
import { Grid } from "./components/grid";
import { GetDerivedStateFromProps } from "react";
import { findLowestInColumn, isWinningMove } from "./utils";

export const promiseMachine = createMachine(
  {
    schema: {
      context: {} as { grid: Piece[][]; currentPlayer: Piece },
      events: {} as { type: "START" } | { type: "PLAY_MOVE" } | { type: "PLAY_WINNING_MOVE" } | { type: "END" } | { type: "RESTART" },
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
          START: { target: "play" },
        },
      },
      play: {
        on: {
          PLAY_MOVE: [
            { cond: "is_winning_move", actions: ["play_winning_move"], target: "end" },
            { cond: "column_valid", actions: ["play"], target: "play" },
          ],
          END: { target: "end" },
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
      play: assign({
        grid: (context, event) => {
          context.grid[findLowestInColumn(context.grid, event.j)][event.j] = context.currentPlayer;
          return context.grid;
        },
        currentPlayer: (context, event) => (context.currentPlayer === PIECE.JAUNE ? PIECE.ROUGE : PIECE.JAUNE),
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

function App() {
  const [state, send] = useMachine(promiseMachine, {});
  console.log(state.context.currentPlayer);
  const onClickHandle = (i: number, j: number) => {
    send("PLAY_MOVE", { i, j });
  };
  return (
    <div className="flex flex-col gap-10 items-center">
      <h1 className="text-black text-lg">Puissance 4</h1>

      <div className="flex gap-8">
        <button onClick={() => send("START")}>START</button>
        <button onClick={() => console.log(state)}>PRINT STATE</button>
        <button onClick={() => console.log(state.context)}>PRINT CONTEXT</button>
        <button onClick={() => send("END")}>FINISH_GAME</button>
      </div>
      <div className="flex space-x-3">
        <p>Current player: </p>
        {state.context.currentPlayer === PIECE.JAUNE ? (
          <div className={clsx("rounded-full h-6 w-6 col-span-1 bg-yellow-300")} />
        ) : (
          <div className={clsx("rounded-full h-6 w-6 col-span-1 bg-red-300")} />
        )}
      </div>
      <Grid grid={state.context.grid} onClickHandle={onClickHandle} />
      {state.value === "end" && <p>You Win!!</p>}
    </div>
  );
}

export default App;
