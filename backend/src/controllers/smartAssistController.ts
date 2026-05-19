import { Request, Response, NextFunction } from "express";

import { SmartAssistService } from "../services/smartAssistService";

import {
  smartAssistRequestSchema,
} from "../schemas/smartAssistSchemas";

const smartAssistService =
  new SmartAssistService();

export class SmartAssistController {
  async generate(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const data =
        smartAssistRequestSchema.parse(request.body);

      const recommendations =
        await smartAssistService.generateRecommendations(
          data
        );

      return response.json(recommendations);
    } catch (error) {
      next(error);
    }
  }
}