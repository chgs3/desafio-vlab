import { z } from "zod";

export const lessonPlanFormSchema = z.object({
  title: z.string().min(3, "Informe um título com pelo menos 3 caracteres."),
  objective: z.string().min(5, "Informe o objetivo da aula."),
  summary: z.string().min(10, "Informe uma ementa/resumo mais completa."),
  plannedDate: z.string().min(1, "Informe a data prevista."),
  discipline: z.string().min(2, "Informe a disciplina."),
  contents: z.array(z.string()),
  supportResources: z.array(z.string()),
  tags: z.array(z.string()),
});

export type LessonPlanFormSchema = z.infer<typeof lessonPlanFormSchema>;