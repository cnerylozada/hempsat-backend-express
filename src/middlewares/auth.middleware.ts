import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabaseClient } from "../libs/supabase";

declare global {
  namespace Express {
    interface Request {
      token?: string;
      jti?: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.SUPABASE_JWT_SECRET!,
    ) as jwt.JwtPayload;

    if (!decoded.jti) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const { data } = await supabaseClient(token)
      .from("sessions")
      .select("id")
      .eq("id", decoded.jti)
      .single();

    if (!data) {
      res.status(401).json({ error: "Session expired" });
      return;
    }

    req.token = token;
    req.jti = decoded.jti;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
