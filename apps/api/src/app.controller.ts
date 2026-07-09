import { Controller, Get, Header } from "@nestjs/common";

import { getAppById, renderShellHtml } from "@repo/site-config";

import { AppService, type HelloResponse } from "./app.service";

const app = getAppById("api")!;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header("content-type", "text/html; charset=utf-8")
  getHome(): string {
    return renderShellHtml({
      app,
      bodyHtml: `
        <span class="hero-badge">${app.framework}</span>
        <h1 class="hero-title">This page is NestJS</h1>
        <p class="hero-subtitle">
          The <code>/api</code> path is a NestJS application. It renders this
          page server-side and exposes <code>GET /api/hello</code>, which the
          other five frameworks fetch in the browser.
        </p>
        <ul class="fact-list">
          <li><span class="fact-label">Framework</span><code>${app.framework}</code></li>
          <li><span class="fact-label">Canonical path</span><code>/${app.subdomain}</code></li>
          <li><span class="fact-label">Subdomain alias</span><code>${app.subdomain}.* → /${app.subdomain}</code></li>
          <li><span class="fact-label">Dev port</span><code>${app.devPort}</code></li>
        </ul>
        <section class="api-demo">
          <h2>GET /api/hello</h2>
          <p>The same endpoint every other app on this site consumes.</p>
          <pre data-api-demo>Loading…</pre>
        </section>`,
    });
  }

  @Get("hello")
  getHello(): HelloResponse {
    return this.appService.getHello();
  }
}
