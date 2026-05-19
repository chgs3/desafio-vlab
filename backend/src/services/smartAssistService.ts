import { GoogleGenAI } from "@google/genai";

import { env } from "../config/env";
import { logger } from "../config/logger";

import {
  SmartAssistRequestInput,
  smartAssistResponseSchema,
} from "../schemas/smartAssistSchemas";

import { AppError } from "../utils/AppError";

if (!env.AI_API_KEY) {
  throw new Error("AI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey: env.AI_API_KEY,
});

export class SmartAssistService {
  async generateRecommendations(
    input: SmartAssistRequestInput
  ) {
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
          model: "gemini-2.5-flash",
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

      const text =
        (response as any).text?.trim() ??
        "";

      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsedJson = JSON.parse(cleanedText);

      const validated =
        smartAssistResponseSchema.parse(parsedJson);

      logger.info({
        message: "AI Request completed",
        title: input.title,
        discipline: input.discipline,
        latencyMs,
      });

      return validated;
    } catch (error) {
      const latencyMs = Date.now() - startTime;

      logger.error({
        message: "AI Request failed",
        title: input.title,
        discipline: input.discipline,
        latencyMs,
        error,
      });

      throw new AppError(
        "Unable to generate AI recommendations",
        500
      );
    }
  }
}