import { Injectable } from "@nestjs/common";

export interface HelloResponse {
  message: string;
  framework: string;
  servedFrom: string;
  timestamp: string;
}

@Injectable()
export class AppService {
  getHello(): HelloResponse {
    return {
      message: "Hello from /api (NestJS)!",
      framework: "NestJS",
      servedFrom: process.env.VERCEL_URL ?? `localhost:${process.env.PORT ?? 3006}`,
      timestamp: new Date().toISOString(),
    };
  }
}
