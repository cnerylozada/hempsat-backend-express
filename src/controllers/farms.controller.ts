import { Request, Response } from "express";
import { extractTitleDeedData } from "../services/title-deed.service";

export const validateTitleDeed = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const files = req.files as Express.Multer.File[];

  try {
    const data = await extractTitleDeedData(files);
    res.json(data);
  } catch (err) {
    if (err instanceof Error && err.message.includes("valid title deed")) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.error("title deed extraction error:", err);
    res.status(500).json({ error: "Failed to analyze title deed" });
  }
};
