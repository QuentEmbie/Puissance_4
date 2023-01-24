import "./index.css";
import { assign, createMachine, interpret } from "xstate";
import { useMachine } from "@xstate/react";
import clsx from "clsx";
import { PIECE, Piece, Player } from "./types";
import { Grid } from "./components/grid";
import { GetDerivedStateFromProps } from "react";
import { currentPlayer, findLowestInColumn, isWinningMove } from "./utils";
import { AddPlayer } from "./components/add_player";

export const promiseMachine = createMachine(
  {
    schema: {
      context: {} as { grid: Piece[][]; currentPlayer?: 0 | 1; players: Player[] },
      events: {} as { type: "START" } | { type: "PLAY_MOVE" } | { type: "END" } | { type: "RESTART" } | { type: "ADD_PLAYER" },
    },
    id: "promise",
    initial: "waiting",
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
      players: [],
    },
    states: {
      waiting: {
        entry: ["cleanGrid"],
        on: {
          START: { target: "play", cond: "are_two_players" },
          ADD_PLAYER: { cond: "less_than_two_players", target: "waiting", actions: ["add_player"] },
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
      play: assign((context, event) => {
        context.grid[findLowestInColumn(context.grid, event.j)][event.j] = currentPlayer(context).color;
        context.currentPlayer = context.currentPlayer === 0 ? 1 : 0;
        return context;
      }),
      play_winning_move: assign((context, event) => {
        context.grid[findLowestInColumn(context.grid, event.j)][event.j] = currentPlayer(context).color;
        return context;
      }),
      add_player: assign((context, event) => {
        context.players = [...context.players, { name: event.name, color: "r" }];
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
        return isWinningMove(context.grid, event.j, currentPlayer(context).color);
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

function App() {
  const [state, send] = useMachine(promiseMachine, {});
  console.log(state.context.currentPlayer);
  const onClickHandle = (j: number) => {
    send("PLAY_MOVE", { j });
  };
  const addPlayer = (name: String) => {
    send("ADD_PLAYER", { name });
  };
  return (
    <div className="flex flex-col gap-10 items-center">
      <h1 className="text-black text-lg">Puissance 4</h1>
      <AddPlayer onClick={addPlayer}></AddPlayer>
      <div>
        {state.context.players.map((player) => (
          <div>{player.name} </div>
        ))}
      </div>
      <div className="flex gap-8">
        <button onClick={() => send("START")}>START</button>
        <button onClick={() => console.log(state)}>PRINT STATE</button>
        <button onClick={() => console.log(state.context)}>PRINT CONTEXT</button>
        <button onClick={() => send("END")}>FINISH_GAME</button>
      </div>

      {state.value === "play" && (
        <div className="flex space-x-3">
          <p>Current player: </p>
          <div
            className={clsx(
              "rounded-full h-6 w-6 col-span-1",
              currentPlayer(state.context).color === PIECE.JAUNE ? " bg-yellow-300" : "bg-red-300"
            )}
          />
        </div>
      )}
      <Grid grid={state.context.grid} onClickHandle={onClickHandle} />
      {state.value === "end" && (
        <>
          <p>{currentPlayer(state.context).name} Win!!</p>
          <button onClick={() => send("RESTART")}>RESTART</button>
        </>
      )}
    </div>
  );
}

export default App;
