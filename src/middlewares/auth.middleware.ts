import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabaseClient } from "../libs/supabase";

declare global {
  namespace Express {
    interface Request {
      token?: string;
      jti?: string;
      userId?: string;
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

    if (!decoded.sub || !decoded.jti) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const { data, error } = await supabaseClient(token)
      .from("sessions")
      .select("id")
      .eq("id", decoded.jti)
      .single();

    if (!data || error) {
      res.status(401).json({
        error: `Error fetching sessions`,
      });
      return;
    }

    req.token = token;
    req.jti = decoded.jti;
    req.userId = decoded.sub;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: error.message, code: "TOKEN_EXPIRED" });
      return;
    }
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(401).json({ error: message });
  }
};
