import { AddPlayer } from "../components/add_player";
import { useGame } from "../components/context";
import { are_two_players, less_or_equal_to_two_players } from "../guards";

export const PlayerSection = () => {
  const { send, context } = useGame();
  return (
    <div className="flex flex-col gap-4">
      <AddPlayer number={0}></AddPlayer>
      <AddPlayer number={1}></AddPlayer>
      {are_two_players(context, { type: "START" }) && <button onClick={() => send({ type: "START" })}>START</button>}
    </div>
  );
};
