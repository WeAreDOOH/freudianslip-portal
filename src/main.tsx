import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";
import "./index.css";
import "./global.css";

// Keep layout width stable between routes (avoid subtle shifts when pages become scrollable)
// Ensures the browser reserves scrollbar space consistently.
document.documentElement.style.scrollbarGutter = "stable";
document.body.style.overflowY = "scroll";

// Allow prod to override auth config via Amplify env vars
const cfg: any = structuredClone(outputs);

cfg.auth = cfg.auth ?? {};
cfg.auth.aws_region = import.meta.env.VITE_AWS_REGION ?? cfg.auth.aws_region;
cfg.auth.user_pool_id = import.meta.env.VITE_USER_POOL_ID ?? cfg.auth.user_pool_id;
cfg.auth.user_pool_client_id =
  import.meta.env.VITE_USER_POOL_CLIENT_ID ?? cfg.auth.user_pool_client_id;

try {
  Amplify.configure(cfg);
  console.log("Amplify configured", {
    region: cfg.auth.aws_region,
    userPoolId: cfg.auth.user_pool_id,
    clientId: cfg.auth.user_pool_client_id,
  });
} catch (err) {
  console.error("Amplify.configure failed", err);
}

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error('Missing <div id="root"></div> in index.html');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);