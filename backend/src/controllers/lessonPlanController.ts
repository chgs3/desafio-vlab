import { Request, Response, NextFunction } from "express";
import { LessonPlanService } from "../services/lessonPlanService";
import {
  createLessonPlanSchema,
  listLessonPlansQuerySchema,
  updateLessonPlanSchema,
} from "../schemas/lessonPlanSchemas";

const lessonPlanService = new LessonPlanService();

export class LessonPlanController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const data = createLessonPlanSchema.parse(request.body);
      const lessonPlan = await lessonPlanService.create(data);

      return response.status(201).json(lessonPlan);
    } catch (error) {
      next(error);
    }
  }

  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const query = listLessonPlansQuerySchema.parse(request.query);
      const result = await lessonPlanService.list(query);

      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const lessonPlan = await lessonPlanService.findById(id);

      return response.json(lessonPlan);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const data = updateLessonPlanSchema.parse(request.body);
      const lessonPlan = await lessonPlanService.update(id, data);

      return response.json(lessonPlan);
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      await lessonPlanService.delete(id);

      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}