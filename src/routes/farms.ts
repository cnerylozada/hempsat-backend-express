import { Router } from "express";
import { createFarm, getMyFarms } from "../controllers/farms.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { titleDeedUploadMiddleware } from "../middlewares/title-deed.middleware";

const router = Router();

router.get("/farms", authMiddleware, getMyFarms);
router.post("/farms", authMiddleware, titleDeedUploadMiddleware, createFarm);

export default router;
