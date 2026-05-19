import { api } from "./client";

import type {
  LessonPlan,
  LessonPlanFormData,
  LessonPlansResponse,
  SmartAssistResponse,
} from "../types/lessonPlan";

export type LessonPlanFilters = {
  page?: number;
  limit?: number;
  search?: string;
  discipline?: string;
  tag?: string;
  plannedDate?: string;
  sortBy?: "title" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export async function listLessonPlans(filters: LessonPlanFilters) {
  const response = await api.get<LessonPlansResponse>("/lesson-plans", {
    params: filters,
  });

  return response.data;
}

export async function getLessonPlan(id: string) {
  const response = await api.get<LessonPlan>(`/lesson-plans/${id}`);
  return response.data;
}

export async function createLessonPlan(data: LessonPlanFormData) {
  const response = await api.post<LessonPlan>("/lesson-plans", data);
  return response.data;
}

export async function updateLessonPlan(
  id: string,
  data: Partial<LessonPlanFormData>
) {
  const response = await api.put<LessonPlan>(`/lesson-plans/${id}`, data);
  return response.data;
}

export async function deleteLessonPlan(id: string) {
  await api.delete(`/lesson-plans/${id}`);
}

export async function generateRecommendations(data: {
  title: string;
  discipline: string;
  summary: string;
}) {
  const response = await api.post<SmartAssistResponse>(
    "/smart-assist/recommendations",
    data
  );

  return response.data;
}