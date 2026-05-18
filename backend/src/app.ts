import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";

import { env } from "./config/env";
import { logger } from "./config/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { routes } from "./routes";

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
  })
);

app.use(express.json());

app.use(
  pinoHttp({
    logger,
  })
);

app.get("/health", (_request, response) => {
  return response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use(routes);

app.use(errorHandler);