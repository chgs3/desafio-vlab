import { z } from "zod";

export const smartAssistRequestSchema = z.object({
  title: z.string().min(3).max(120),
  discipline: z.string().min(2).max(100),
  summary: z.string().min(10).max(2000),
});

export const smartAssistResponseSchema = z.object({
  complementaryContents: z.array(z.string()),
  relatedTopics: z.array(z.string()),
  supportResources: z.array(z.string()),
  recommendedTags: z.array(z.string()).length(3),
});

export type SmartAssistRequestInput =
  z.infer<typeof smartAssistRequestSchema>;

export type SmartAssistResponse =
  z.infer<typeof smartAssistResponseSchema>;