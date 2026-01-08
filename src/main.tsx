import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";
import "./index.css";

// Configure Amplify from amplify_outputs.json.
// If config is wrong, we STILL mount React and log the issue.
try {
  Amplify.configure(outputs as any);
  // eslint-disable-next-line no-console
  console.log("Amplify configured");
} catch (err) {
  // eslint-disable-next-line no-console
  console.error("Amplify.configure failed", err);
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error('Missing <div id="root"></div> in index.html');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);