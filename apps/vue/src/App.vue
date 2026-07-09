<script setup lang="ts">
import { onMounted } from "vue";

import {
  appPath,
  getAppById,
  GITHUB_URL,
  hydrateApiDemo,
  ROOT_APP,
  SITE_APPS,
  SITE_NAME,
} from "@repo/site-config";

const app = getAppById("vue")!;

onMounted(() => {
  hydrateApiDemo();
});
</script>

<template>
  <header class="site-header">
    <a class="site-brand" :href="appPath(ROOT_APP)">
      <span class="site-brand-dot" />
      {{ SITE_NAME }}
    </a>
    <a :href="GITHUB_URL" target="_blank" rel="noreferrer">GitHub</a>
    <nav class="site-nav">
      <a
        v-for="navApp in SITE_APPS"
        :key="navApp.id"
        :href="appPath(navApp)"
        :aria-current="navApp.id === app.id ? 'page' : undefined"
      >
        {{ navApp.name }}
      </a>
    </nav>
  </header>
  <main class="site-main">
    <span class="hero-badge">{{ app.framework }}</span>
    <h1 class="hero-title">This page is Vue</h1>
    <p class="hero-subtitle">
      A Vue 3 single-page app built with Vite. The Hono proxy forwards every
      request under <code>/vue</code> here — same navigation, same styles,
      different framework.
    </p>

    <ul class="fact-list">
      <li>
        <span class="fact-label">Framework</span>
        <code>{{ app.framework }}</code>
      </li>
      <li>
        <span class="fact-label">Canonical path</span>
        <code>/{{ app.subdomain }}</code>
      </li>
      <li>
        <span class="fact-label">Subdomain alias</span>
        <code>{{ app.subdomain }}.* → /{{ app.subdomain }}</code>
      </li>
      <li>
        <span class="fact-label">Dev port</span>
        <code>{{ app.devPort }}</code>
      </li>
    </ul>

    <section class="api-demo">
      <h2>Live data from the NestJS app</h2>
      <p>
        Fetched in the browser from the <code>api</code> subdomain — a different
        framework, a different deployment, one site.
      </p>
      <pre data-api-demo>Loading…</pre>
    </section>
  </main>
  <footer class="site-footer">
    {{ SITE_NAME }} — one site, many frameworks. This page is served by
    {{ app.framework }}.
    <a :href="GITHUB_URL" target="_blank" rel="noreferrer">Source on GitHub</a>
  </footer>
</template>
