import { useMachine } from "@xstate/react";
import clsx from "clsx";
import { FC } from "react";
import { promiseMachine } from "../App";
import { Piece } from "../types";

export const Grid: FC<{ grid: Piece[][] }> = ({ grid }) => {
  const gridSize = `grid-cols-${grid[0].length}`;
  const [state, send] = useMachine(promiseMachine);
  const onClickHandle = (i: number, j: number) => {
    send("PLAY_WINNING_MOVE", { i, j });
    send("PLAY_MOVE", { i, j });
  };
  return (
    <div className={clsx("grid w-fit bg-blue-400 p-1 gap-1", "grid-cols-8")}>
      {grid.map((row, i) => {
        return row.map((el, j) => (
          <div
            onClick={() => onClickHandle(i, j)}
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
