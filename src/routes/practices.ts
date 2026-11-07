import { Router } from "express";
import {
  getPracticeById,
  getPracticeListByAreaId,
} from "../controllers/practices/practices.controller";
import { createMulchingPractice } from "../controllers/practices/mulching/mulching.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { photosUpload } from "../libs/multer";

const router = Router();

router.get("/practices/:areaId", authMiddleware, getPracticeListByAreaId);
router.get("/practices/:areaId/:practiceId", authMiddleware, getPracticeById);
router.post(
  "/practices/:areaId/mulching",
  authMiddleware,
  photosUpload,
  createMulchingPractice,
);

export default router;
