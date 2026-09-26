import { Router } from "express";
import {
  addNewAreaInFarm,
  getAreasByFarmId,
} from "../controllers/areas/areas.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { areaPhotosUpload } from "../libs/multer";

const router = Router();

router.get("/areas/:farmId", authMiddleware, getAreasByFarmId);
router.post(
  "/areas/:farmId",
  authMiddleware,
  areaPhotosUpload,
  addNewAreaInFarm,
);

export default router;
