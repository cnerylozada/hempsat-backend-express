import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { updateUserIdentity } from "../controllers/users.controller";

const router = Router();

router.patch("/users", authMiddleware, updateUserIdentity);

export default router;
