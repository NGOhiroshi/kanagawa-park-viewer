import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/reset.css";
import "./styles/global.css";
import { App } from "./presentation/App";

const root = document.getElementById("root");
if (!root) throw new Error("#root 要素が見つかりません");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
