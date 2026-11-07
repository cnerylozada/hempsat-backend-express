import { Router } from "express";
import {
  addNewAreaInFarm,
  getAreaById,
  getAreaListByFarmId,
} from "../controllers/areas/areas.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { photosUpload } from "../libs/multer";

const router = Router();

router.get("/areas/:farmId", authMiddleware, getAreaListByFarmId);
router.post(
  "/areas/:farmId",
  authMiddleware,
  photosUpload,
  addNewAreaInFarm,
);
router.get("/areas/:farmId/:areaId", authMiddleware, getAreaById);

export default router;
