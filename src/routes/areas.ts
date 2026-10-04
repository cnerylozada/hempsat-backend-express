import { Router } from "express";
import {
  addNewAreaInFarm,
  getAreaById,
  getAreasByFarmId,
} from "../controllers/areas/areas.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { photosUpload } from "../libs/multer";

const router = Router();

router.get("/areas/:farmId", authMiddleware, getAreasByFarmId);
router.post(
  "/areas/:farmId",
  authMiddleware,
  photosUpload,
  addNewAreaInFarm,
);
router.get("/areas/:farmId/:areaId", authMiddleware, getAreaById);

export default router;
