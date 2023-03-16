import { useMachine } from "@xstate/react";
import { createContext, PropsWithChildren, useContext } from "react";
import { p4Machine } from "../machine";
import { GameContext, GameEvents, State } from "../types";

type P4ContextType = {
  state: State;
  context: GameContext;
  send: (event: GameEvents) => void;
};

const Context = createContext<P4ContextType>({} as P4ContextType);

export const useGame: () => P4ContextType = () => {
  return useContext(Context);
};

export const GameContextProvider = ({ children }: PropsWithChildren) => {
  const [state, send] = useMachine(p4Machine);
  return (
    <Context.Provider
      value={{
        state: state.value as State,
        context: state.context,
        send: send,
      }}
    >
      {children}
    </Context.Provider>
  );
};
