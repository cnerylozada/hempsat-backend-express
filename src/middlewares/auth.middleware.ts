import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    jwt.verify(token, process.env.SUPABASE_JWT_SECRET!);
    req.token = token;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
