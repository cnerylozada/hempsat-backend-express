import express from "express";
import { API_PREFIX } from "./constants";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/authentication";

const app = express();

app.use(express.json());

app.use(API_PREFIX, healthRoutes);
app.use(API_PREFIX, authRoutes);

export default app;
