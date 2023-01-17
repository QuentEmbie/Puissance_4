import clsx from "clsx";
import { FC } from "react";
import { piece } from "../types";

export const Grid: FC<{ grid: piece[][] }> = ({ grid }) => {
  return (
    <div className={clsx("grid w-fit bg-blue-400 p-1 gap-1", `grid-cols-${grid[0].length}`)}>
      {grid.map((row, i) => {
        return row.map((el, j) => (
          <div
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
