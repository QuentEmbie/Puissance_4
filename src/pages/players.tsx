import { AddPlayer } from "../components/add_player";
import { useGame } from "../components/context";

export const PlayerSection = () => {
  console.log("Paye");
  const { send } = useGame();
  // const addPlayer = (playerNumber: number, name: String) => {
  //   if (name.length > 5) send({ type: "ADD_PLAYER", name, playerNumber });
  // };
  return (
    <div>
      <div>
        <AddPlayer onClick={(name) => console.log(name)}></AddPlayer>
      </div>
      <AddPlayer onClick={console.log}></AddPlayer>
    </div>
  );
};
