import { Router } from "express";
import {
  addNewAreaInFarm,
  getAreasByFarmId,
} from "../controllers/areas.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/areas/:farmId", authMiddleware, getAreasByFarmId);
router.post("/areas/:farmId", authMiddleware, addNewAreaInFarm);

export default router;
