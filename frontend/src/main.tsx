import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app.tsx";
import "./i18n";

const element = document.querySelector("#root");

if (element !== null) {
  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
