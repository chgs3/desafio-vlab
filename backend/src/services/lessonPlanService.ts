import {
  CreateLessonPlanInput,
  ListLessonPlansQuery,
  UpdateLessonPlanInput,
} from "../schemas/lessonPlanSchemas";
import { LessonPlanRepository } from "../repositories/lessonPlanRepository";

export class LessonPlanService {
  constructor(private lessonPlanRepository = new LessonPlanRepository()) {}

  async create(data: CreateLessonPlanInput) {
    return this.lessonPlanRepository.create(data);
  }

  async list(query: ListLessonPlansQuery) {
    return this.lessonPlanRepository.list(query);
  }

  async findById(id: string) {
    const lessonPlan = await this.lessonPlanRepository.findById(id);

    if (!lessonPlan) {
      throw new Error("LESSON_PLAN_NOT_FOUND");
    }

    return lessonPlan;
  }

  async update(id: string, data: UpdateLessonPlanInput) {
    await this.findById(id);

    return this.lessonPlanRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);

    return this.lessonPlanRepository.delete(id);
  }
}