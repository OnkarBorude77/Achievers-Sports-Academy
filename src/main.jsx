import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { SettingsProvider } from "./components/SettingsContext.jsx";
import "./styles.css";

// HashRouter keeps page refreshes working on any static host.
// If your host supports SPA rewrites you can swap it for BrowserRouter.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SettingsProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </SettingsProvider>
  </React.StrictMode>
);