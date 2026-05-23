import { Router } from "express";
import { getHealth } from "../controllers/health.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/health", authMiddleware, getHealth);

export default router;
