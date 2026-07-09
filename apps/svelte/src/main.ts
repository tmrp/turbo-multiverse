import { mount } from "svelte";

import { getAppById, SITE_STYLES } from "@repo/site-config";

import App from "./App.svelte";

const app = getAppById("svelte")!;

const style = document.createElement("style");
style.textContent = SITE_STYLES;
document.head.append(style);
document.body.style.setProperty("--accent", app.accent);

mount(App, { target: document.getElementById("app")! });
