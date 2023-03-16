import clsx from "clsx";
import { FC } from "react";
import { PIECE } from "../types";
import { useGame } from "./context";

export const ColorCircle: FC<{ playerNumber: number }> = ({ playerNumber }) => {
  const { context } = useGame();
  return (
    <div
      className={clsx("rounded-full h-6 w-6 col-span-1", context.colors[playerNumber] === PIECE.JAUNE ? " bg-yellow-300" : "bg-red-300")}
    />
  );
};
