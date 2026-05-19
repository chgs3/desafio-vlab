export type LessonPlan = {
  id: string;
  title: string;
  objective: string;
  summary: string;
  plannedDate: string;
  discipline: string;
  contents: string[];
  supportResources: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type LessonPlanFormData = {
  title: string;
  objective: string;
  summary: string;
  plannedDate: string;
  discipline: string;
  contents: string[];
  supportResources: string[];
  tags: string[];
};

export type LessonPlansResponse = {
  data: LessonPlan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SmartAssistResponse = {
  complementaryContents: string[];
  relatedTopics: string[];
  supportResources: string[];
  recommendedTags: string[];
};