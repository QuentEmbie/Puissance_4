import { useActor } from "@xstate/react";
import { useContext } from "react";
import { P4Context } from "../App";
import { AddPlayer } from "../components/add_player";

export const PlayerSection = () => {
  const p4Services = useContext(P4Context);
  const [state, send] = useActor(p4Services.p4Service);
  const addPlayer = (playerNumber: number, name: String) => {
    if (name.length > 2) send({ type: "ADD_PLAYER", name, playerNumber });
  };
  return (
    <div>
      <div>
        <AddPlayer onClick={(name) => addPlayer(0, name)}></AddPlayer>
      </div>
      <AddPlayer onClick={(name) => addPlayer(1, name)}></AddPlayer>
    </div>
  );
};
