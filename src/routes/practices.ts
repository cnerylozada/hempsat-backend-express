import { Router } from "express";
import {
  getPracticeById,
  getPracticesByAreaId,
} from "../controllers/practices/practices.controller";
import { createMulchingPractice } from "../controllers/practices/mulching/mulching.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { photosUpload } from "../libs/multer";

const router = Router();

router.get("/practices/:areaId", authMiddleware, getPracticesByAreaId);
router.get("/practices/:areaId/:practiceId", authMiddleware, getPracticeById);
router.post(
  "/practices/:areaId/mulching",
  authMiddleware,
  photosUpload,
  createMulchingPractice,
);

export default router;
