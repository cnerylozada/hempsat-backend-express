import { Router } from "express";
import {
  createFarm,
  getFarmById,
  getMyFarmList,
} from "../controllers/farms.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { titleDeedUploadMiddleware } from "../middlewares/title-deed.middleware";

const router = Router();

router.get("/farms", authMiddleware, getMyFarmList);
router.get("/farms/:id", authMiddleware, getFarmById);
router.post("/farms", authMiddleware, titleDeedUploadMiddleware, createFarm);

export default router;
