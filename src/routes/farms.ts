import { Router } from "express";
import { validateTitleDeed } from "../controllers/farms.controller";
import { titleDeedUploadMiddleware } from "../middlewares/title-deed.middleware";

const router = Router();

router.post("/farms/title-deeds", titleDeedUploadMiddleware, validateTitleDeed);

export default router;
