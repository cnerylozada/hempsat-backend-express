import { Router } from "express";
import {
  getPracticeById,
  getPracticesByAreaId,
} from "../controllers/practices";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/practices/:areaId", authMiddleware, getPracticesByAreaId);
router.get("/practices/:areaId/:practiceId", authMiddleware, getPracticeById);

export default router;
