import multer from "multer";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
export const MIN_FILE_SIZE_BYTES = 50 * 1024; // 50 KB
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_FILES = 3;
export const TITLE_DEEDS_FIELD = "images";
const MAX_PHOTOS = 10;
const PHOTOS_FIELD = "images";

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG and PNG images are allowed"));
  }
};

export const titleDeedUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_FILES },
  fileFilter: imageFileFilter,
});

export const photosUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_PHOTOS },
  fileFilter: imageFileFilter,
}).array(PHOTOS_FIELD, MAX_PHOTOS);
