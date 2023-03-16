import clsx from "clsx";
import { FC } from "react";
import { GameModel } from "../machine";
import { Piece } from "../types";
import { useGame } from "./context";

export const Grid: FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  const { state, context, send } = useGame();
  const onClickHandle = (j: number) => {
    send(GameModel.events.PLAY_MOVE(j));
  };
  return (
    <div className={clsx("grid w-fit bg-blue-400 p-1 gap-1", "grid-cols-8")}>
      {context.grid.map((row, i) => {
        return row.map((el, j) => (
          <div
            onClick={() => !readOnly && onClickHandle(j)}
            className={clsx(
              "rounded-full h-6 w-6 col-span-1",
              el === "v" && "bg-slate-100",
              el === "j" && "bg-yellow-300",
              el === "r" && "bg-red-300"
            )}
            key={`${i}-${j}`}
          />
        ));
      })}
    </div>
  );
};
