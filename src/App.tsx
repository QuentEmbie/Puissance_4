import "./index.css";
import clsx from "clsx";
import { PIECE, STATE } from "./types";
import { Grid } from "./components/grid";

import { currentColor, currentPlayerName } from "./utils";
import { PlayerSection } from "./pages/players";
import { useGame } from "./components/context";

function App() {
  const { state, context, send } = useGame();
  console.log("state ", state);

  const onClickHandle = (j: number) => {
    send({ type: "PLAY_MOVE", j });
  };

  return (
    <div className="flex flex-col gap-10 items-center">
      <h1 className="text-black text-lg">Puissance 4</h1>
      <h1 className="text-black text-lg">{state}</h1>
      <div className="flex gap-8">
        <button onClick={() => send({ type: "START" })}>START</button>
        <button onClick={() => console.log(state)}>PRINT STATE</button>
        <button onClick={() => console.log(context)}>PRINT CONTEXT</button>
        <button onClick={() => send({ type: "END" })}>FINISH_GAME</button>
      </div>
      {state === STATE.WAITING && <PlayerSection />}
      <div className="flex flex-row space-x-10">
        {[0, 1].map((playerNumber) => (
          <div className="flex space-x-3">
            <p>{context.players[playerNumber]}</p>
            <div
              className={clsx(
                "rounded-full h-6 w-6 col-span-1",
                context.colors[playerNumber] === PIECE.JAUNE ? " bg-yellow-300" : "bg-red-300"
              )}
            />
          </div>
        ))}
      </div>

      {state === STATE.PLAY && (
        <div className="flex flex-col gap-3 items-center">
          <Grid grid={context.grid} onClickHandle={onClickHandle} />
          <div className="flex space-x-3">
            <p>Current player: </p>
            <div
              className={clsx("rounded-full h-6 w-6 col-span-1", currentColor(context) === PIECE.JAUNE ? " bg-yellow-300" : "bg-red-300")}
            />
          </div>
        </div>
      )}
      {state === STATE.END && (
        <>
          <Grid grid={context.grid} onClickHandle={onClickHandle} />
          <p>{currentPlayerName(context)} Win!!</p>
          <button onClick={() => send({ type: "RESTART" })}>RESTART</button>
        </>
      )}
    </div>
  );
}

export default App;
