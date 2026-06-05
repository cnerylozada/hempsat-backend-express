import { Request, Response } from "express";

export const validateTitleDeed = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const files = req.files as Express.Multer.File[];

  res.json({ status: "ok", count: files.length });
};
