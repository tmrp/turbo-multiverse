// Vercel serverless entry. `pnpm build` (nest build → tsc) runs first, so the
// decorator metadata NestJS relies on is already compiled into ../dist.
const { NestFactory } = require("@nestjs/core");
const { ExpressAdapter } = require("@nestjs/platform-express");
const express = require("express");

const { AppModule } = require("../dist/app.module");

const server = express();
let ready;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix("api");
  app.enableCors({ origin: true });
  await app.init();
}

module.exports = async (req, res) => {
  ready ??= bootstrap();
  await ready;
  return server(req, res);
};
