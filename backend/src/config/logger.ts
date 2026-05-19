import pino from "pino";

import { env } from "./env";

const baseLoggerOptions = {
  level: env.LOG_LEVEL,

  base: {
    service: "aulaplan-api",
    environment: process.env.NODE_ENV ?? "development",
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.headers['x-api-key']",
      "apiKey",
      "AI_API_KEY",
    ],
    censor: "[REDACTED]",
  },
};

export const logger = env.LOG_PRETTY
  ? pino({
      ...baseLoggerOptions,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname,service,environment",
        },
      },
    })
  : pino(baseLoggerOptions);