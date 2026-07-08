import multer from "multer";
import { ApiError } from "../utils/ApiError";

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB ?? 5);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain",
]);

const storage = multer.memoryStorage();

export const uploadResume = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(ApiError.unsupportedMedia("Only PDF, DOCX, or TXT resumes are supported."));
      return;
    }
    cb(null, true);
  },
}).single("resumeFile");
