window.global ||= window;
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ApplicationToken } from "./datasource/http/http.manager.ts";
import { TaskProgressTracker } from "./datasource/localstore.api.ts";
import "./index.css";

TaskProgressTracker.getInstance().bootUp();
ApplicationToken.getInstance().bootUp();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
