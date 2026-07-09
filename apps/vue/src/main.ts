import { createApp } from "vue";

import { getAppById, SITE_STYLES } from "@repo/site-config";

import App from "./App.vue";

const app = getAppById("vue")!;

const style = document.createElement("style");
style.textContent = SITE_STYLES;
document.head.append(style);
document.body.style.setProperty("--accent", app.accent);

createApp(App).mount("#app");
