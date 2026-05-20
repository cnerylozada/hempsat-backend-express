import { Router } from "express";
import { signIn } from "../controllers/authentication.controller";

const router = Router();

router.post("/auth/sign-in", signIn);

export default router;
