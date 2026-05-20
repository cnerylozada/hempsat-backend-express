import express from "express";
import { API_PREFIX } from "./constants";
import healthRoutes from "./routes/health.routes";

const app = express();

app.use(express.json());

app.use(API_PREFIX, healthRoutes);

export default app;
