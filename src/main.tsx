import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GameContextProvider } from "./components/context";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GameContextProvider>
      <App />
    </GameContextProvider>
  </React.StrictMode>
);
