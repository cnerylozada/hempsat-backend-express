import express from "express";
import { API_PREFIX } from "./constants";
import healthRoutes from "./routes/health";
import authRoutes from "./routes/authentication";
import farmRoutes from "./routes/farms";
import userRoutes from "./routes/users";

const app = express();

app.use(express.json());

app.use(API_PREFIX, healthRoutes);
app.use(API_PREFIX, authRoutes);
app.use(API_PREFIX, farmRoutes);
app.use(API_PREFIX, userRoutes);

export default app;
