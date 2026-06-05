import { Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";
import { titleDeedUpload, MAX_FILES, TITLE_DEEDS_FIELD } from "../libs/multer";
import {
  TITLE_DEED_MIN_SHORT_SIDE_PX,
  TITLE_DEED_MIN_LONG_SIDE_PX,
  TITLE_DEED_MAX_SHORT_SIDE_PX,
  TITLE_DEED_MAX_LONG_SIDE_PX,
} from "../constants";

const handleUploadError = (err: unknown, res: Response) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_COUNT") {
      res.status(400).json({ error: "At most 3 images are allowed" });
      return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "Each image must be at most 10 MB" });
      return;
    }
  }
  if (err instanceof Error) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: "Upload failed" });
};

const checkDimensions = async (files: Express.Multer.File[]): Promise<string | null> => {
  for (const file of files) {
    const { width = 0, height = 0 } = await sharp(file.buffer).metadata();
    const shortSide = Math.min(width, height);
    const longSide = Math.max(width, height);
    if (shortSide < TITLE_DEED_MIN_SHORT_SIDE_PX || longSide < TITLE_DEED_MIN_LONG_SIDE_PX) {
      return `Each image must be at least ${TITLE_DEED_MIN_SHORT_SIDE_PX}×${TITLE_DEED_MIN_LONG_SIDE_PX}px (short side × long side)`;
    }
    if (shortSide > TITLE_DEED_MAX_SHORT_SIDE_PX || longSide > TITLE_DEED_MAX_LONG_SIDE_PX) {
      return `Each image must be at most ${TITLE_DEED_MAX_SHORT_SIDE_PX}×${TITLE_DEED_MAX_LONG_SIDE_PX}px (short side × long side)`;
    }
  }
  return null;
};

export const titleDeedUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  titleDeedUpload.array(TITLE_DEEDS_FIELD, MAX_FILES)(req, res, async (err) => {
    if (err) {
      handleUploadError(err, res);
      return;
    }

    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      res.status(400).json({ error: "At least 1 image is required" });
      return;
    }

    const dimensionError = await checkDimensions(files);
    if (dimensionError) {
      res.status(400).json({ error: dimensionError });
      return;
    }

    next();
  });
};
