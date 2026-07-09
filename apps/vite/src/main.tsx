import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { getAppById, SITE_STYLES } from "@repo/site-config";

import { App } from "./App";

const app = getAppById("vite")!;

const style = document.createElement("style");
style.textContent = SITE_STYLES;
document.head.append(style);
document.body.style.setProperty("--accent", app.accent);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
