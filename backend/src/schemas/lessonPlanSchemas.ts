import { z } from "zod";

export const createLessonPlanSchema = z.object({
  title: z.string().min(3).max(120),
  objective: z.string().min(5).max(1000),
  summary: z.string().min(10).max(2000),
  plannedDate: z.coerce.date(),
  discipline: z.string().min(2).max(100),
  contents: z.array(z.string().min(1).max(200)).max(20).default([]),
  supportResources: z.array(z.string().min(1).max(200)).max(20).default([]),
  tags: z.array(z.string().min(1).max(50)).max(10).default([]),
});

export const updateLessonPlanSchema = createLessonPlanSchema.partial();

export const listLessonPlansQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().optional(),
  discipline: z.string().optional(),
  tag: z.string().optional(),
  plannedDate: z.string().optional(),
  sortBy: z.enum(["title", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateLessonPlanInput = z.infer<typeof createLessonPlanSchema>;
export type UpdateLessonPlanInput = z.infer<typeof updateLessonPlanSchema>;
export type ListLessonPlansQuery = z.infer<typeof listLessonPlansQuerySchema>;