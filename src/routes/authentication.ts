import { Router } from "express";
import { signIn, signOut } from "../controllers/authentication.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/auth/sign-in", signIn);
router.post("/auth/sign-out", authMiddleware, signOut);

export default router;
