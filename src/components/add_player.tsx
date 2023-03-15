import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useGame } from "./context";

type FormData = {
  name: string;
};

export const AddPlayer: FC<{ number: number }> = ({ number }) => {
  const { send } = useGame();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    send({ type: "ADD_PLAYER", name: data.name, playerNumber: number });
  };

  return (
    <>
      <form className="flex gap-6" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" className="border" {...register("name", { required: "Ce champ ne peut pas être vide" })}></input>
        <button type="submit">Add a player</button>
      </form>
      {errors.name && (
        <p role="alert" className="text-red-700">
          {errors.name?.message}
        </p>
      )}
    </>
  );
};
