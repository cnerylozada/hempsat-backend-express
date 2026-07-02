import { Router } from "express";
import { createFarm, getFarmById, getMyFarms } from "../controllers/farms.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { titleDeedUploadMiddleware } from "../middlewares/title-deed.middleware";

const router = Router();

router.get("/farms", authMiddleware, getMyFarms);
router.get("/farms/:id", authMiddleware, getFarmById);
router.post("/farms", authMiddleware, titleDeedUploadMiddleware, createFarm);

export default router;
