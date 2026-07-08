import { Router } from "express";
import { uploadResume } from "../middleware/upload";
import { normalizeMultipartBody } from "../middleware/normalizeMultipart";
import { validateBody } from "../middleware/validate";
import { analyzeRequestSchema, pdfExportSchema } from "../validation/resume.schema";
import { analyzeResume, exportAnalysisPdf } from "../controllers/resume.controller";

const router = Router();

router.post(
  "/analyze",
  uploadResume,
  normalizeMultipartBody,
  validateBody(analyzeRequestSchema),
  analyzeResume
);

router.post("/pdf", validateBody(pdfExportSchema), exportAnalysisPdf);

export default router;
