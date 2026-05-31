import { Router } from "express";
import { getKycData } from "../controllers/kyc.controller";

const router = Router();

router.get("/kyc/:inquiryId", getKycData);

export default router;
