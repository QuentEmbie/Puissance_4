import "./index.css";
import { createMachine, interpret } from "xstate";
import { useMachine } from "@xstate/react";
import clsx from "clsx";
import { piece } from "./types";
import { Grid } from "./components/grid";

const promiseMachine = createMachine(
  {
    schema: {
      context: {} as { players?: string[]; grid: piece[][] },
      events: {} as { type: "new_player" } | { type: "play_move" } | { type: "play_final_move" } | { type: "restart" },
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
    },
    states: {
      waiting: {
        on: {
          new_player: { target: "play" },
        },
      },
      play: {
        on: {
          play_move: { target: "play", actions: ["play"] },
          play_final_move: { target: "end" },
        },
      },
      end: {
        on: {
          restart: { target: "waiting" },
        },
      },
    },
  },
  {
    actions: {
      play: (context, event) => {
        console.log("yoo");
        console.log(context, event);
      },
    },
  }
);

function App() {
  const promiseService = interpret(promiseMachine).onTransition((state) => console.log(state.value));
  const [state, send] = useMachine(promiseMachine);

  //promiseService.start();

  //promiseService.onTransition((d) => console.log(d));
  return (
    <div className="flex flex-col gap-10 items-center">
      <h1 className="text-black text-lg">Puissance 4</h1>
      <div className="flex gap-8">
        <button onClick={() => send("new_player")}>new player</button>
        <button onClick={() => promiseService.send({ type: "new_player" })}>play_move</button>
        <button onClick={() => send("play_final_move")}>play_final_move</button>
        <button onClick={() => send("restart")}>restart</button>
      </div>
      <Grid grid={state.context.grid} />
    </div>
  );
}

export default App;
