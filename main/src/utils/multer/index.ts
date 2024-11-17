import multer, { Multer } from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
});
