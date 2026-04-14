import React from "react";
import "./index.css";
import App from "./App";
import { worker } from "./mocks";

import { createRoot } from "react-dom/client";

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Start a mock API server to handle auth requests
void worker.start({
  onUnhandledRequest: "bypass",
});
