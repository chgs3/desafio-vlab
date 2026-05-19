import { Router } from "express";

import { SmartAssistController } from "../controllers/smartAssistController";

export const smartAssistRoutes = Router();

const smartAssistController =
  new SmartAssistController();

smartAssistRoutes.post(
  "/recommendations",
  smartAssistController.generate
);