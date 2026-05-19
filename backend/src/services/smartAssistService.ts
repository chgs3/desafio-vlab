import { GoogleGenAI } from "@google/genai";

import { env } from "../config/env";
import { logger } from "../config/logger";

import {
  SmartAssistRequestInput,
  smartAssistResponseSchema,
} from "../schemas/smartAssistSchemas";

import { AppError } from "../utils/AppError";

const AI_MODEL = "gemini-2.5-flash";

if (!env.AI_API_KEY) {
  throw new Error("AI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey: env.AI_API_KEY,
});

export class SmartAssistService {
  async generateRecommendations(input: SmartAssistRequestInput) {
    const startTime = Date.now();

    const prompt = `
Você é um Assistente Pedagógico especializado em planejamento de aulas.

Com base nos dados abaixo, gere recomendações úteis para enriquecer um plano de aula.

Título da aula:
${input.title}

Disciplina:
${input.discipline}

Ementa/Resumo:
${input.summary}

Responda EXCLUSIVAMENTE em JSON válido.

Formato obrigatório:

{
  "complementaryContents": ["string"],
  "relatedTopics": ["string"],
  "supportResources": ["string"],
  "recommendedTags": ["string", "string", "string"]
}

Regras:
- Gere de 3 a 5 conteúdos complementares.
- Gere de 3 a 5 tópicos relacionados.
- Gere de 2 a 4 recursos de apoio.
- Gere exatamente 3 tags.
- Não use markdown.
- Não explique nada.
`;

    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: AI_MODEL,
          contents: prompt,
        }),

        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("AI_TIMEOUT")),
            env.AI_TIMEOUT_MS
          )
        ),
      ]);

      const latencyMs = Date.now() - startTime;

      const text = ((response as { text?: string }).text ?? "").trim();

      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsedJson = JSON.parse(cleanedText);

      const validated = smartAssistResponseSchema.parse(parsedJson);

      const tokenUsage =
        (response as {
          usageMetadata?: {
            totalTokenCount?: number;
          };
        }).usageMetadata?.totalTokenCount ?? null;

      const latencySeconds = Number((latencyMs / 1000).toFixed(2));

      logger.info({
        event: "ai.request.completed",
        provider: env.AI_PROVIDER ?? "gemini",
        model: AI_MODEL,
        title: input.title,
        discipline: input.discipline,
        tokenUsage,
        latencyMs,
        latencySeconds,
        status: "success",
        msg: `AI Request: Title="${input.title}", Discipline="${input.discipline}", TokenUsage=${tokenUsage ?? "N/A"}, Latency=${latencySeconds}s`,
      });

      return validated;
    } catch (error) {
      const latencyMs = Date.now() - startTime;

      const latencySeconds = Number((latencyMs / 1000).toFixed(2));

      logger.error({
        event: "ai.request.failed",
        provider: env.AI_PROVIDER ?? "gemini",
        model: AI_MODEL,
        title: input.title,
        discipline: input.discipline,
        tokenUsage: null,
        latencyMs,
        latencySeconds,
        status: "error",
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
              }
            : error,
        msg: `AI Request Failed: Title="${input.title}", Discipline="${input.discipline}", TokenUsage=N/A, Latency=${latencySeconds}s`,
      });

      throw new AppError("Unable to generate AI recommendations", 500);
    }
  }
}