import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Served behind the proxy at the /api canonical path.
  app.setGlobalPrefix("api");
  app.enableCors({ origin: true });

  const port = Number(process.env.PORT ?? 3006);
  await app.listen(port);

  console.log(`api listening on http://localhost:${port}`);
}

void bootstrap();
