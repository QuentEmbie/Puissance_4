import { FC, useState } from "react";

export const AddPlayer: FC<{ onClick: (name: String) => void }> = ({ onClick }) => {
  const [name, setName] = useState<String>();
  return (
    <div className="flex gap-6">
      <input type="text" className="border" onChange={(event) => setName(event.target.value)}></input>
      <button onClick={onClick(name ?? "")}>Add a player</button>
    </div>
  );
};
