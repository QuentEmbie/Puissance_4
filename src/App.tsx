import "./index.css";
import clsx from "clsx";
import { PIECE, STATE } from "./types";
import { Grid } from "./components/grid";

import { currentColor, currentPlayerName } from "./utils";
import { PlayerSection } from "./pages/players";
import { useGame } from "./components/context";
import { GameModel } from "./machine";
import { ColorCircle } from "./components/colorCircle";

function App() {
  const { state, context, send } = useGame();

  return (
    <div className="flex flex-col gap-10 items-center mt-20">
      <h1 className="text-black text-lg">Puissance 4</h1>

      <div className="flex flex-row space-x-10">
        {[0, 1].map(
          (playerNumber) =>
            context.players[playerNumber] && (
              <div className="flex space-x-3" key={playerNumber}>
                <p>{context.players[playerNumber]}</p>
                <ColorCircle playerNumber={playerNumber} />
              </div>
            )
        )}
      </div>

      {state === STATE.WAITING && <PlayerSection />}

      {state === STATE.PLAY && (
        <div className="flex flex-col gap-3 items-center">
          <Grid />
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
          <Grid readOnly />
          <ColorCircle playerNumber={context.currentPlayer} />
          <p>{currentPlayerName(context)} Win!!</p>
        </>
      )}
      {state !== STATE.WAITING && (
        <div className="flex gap-8">
          <button onClick={() => send(GameModel.events.RESTART())}>RESTART GAME</button>
        </div>
      )}
    </div>
  );
}

export default App;
