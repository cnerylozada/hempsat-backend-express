import express from "express";
import { API_PREFIX } from "./constants";
import healthRoutes from "./routes/health";
import authRoutes from "./routes/authentication";
import kycRoutes from "./routes/kyc";
import farmRoutes from "./routes/farms";

const app = express();

app.use(express.json());

app.use(API_PREFIX, healthRoutes);
app.use(API_PREFIX, authRoutes);
app.use(API_PREFIX, kycRoutes);
app.use(API_PREFIX, farmRoutes);

export default app;
