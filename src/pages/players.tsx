import { AddPlayer } from "../components/add_player";

export const PlayerSection = () => {
  return (
    <div>
      <AddPlayer number={0}></AddPlayer>
      <AddPlayer number={1}></AddPlayer>
    </div>
  );
};
