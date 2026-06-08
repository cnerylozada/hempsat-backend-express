import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getUserById,
  updateUserIdentity,
} from "../controllers/users.controller";

const router = Router();

router.get("/users/me", authMiddleware, getUserById);
router.patch("/users", authMiddleware, updateUserIdentity);

export default router;
