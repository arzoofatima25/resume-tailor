import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { extractResumeText } from "../services/fileParser.service";
import { analyzeResumeWithGemini } from "../services/gemini.service";
import { generateAnalysisPdf } from "../services/pdf.service";
import { AnalyzeRequestInput, PdfExportInput } from "../validation/resume.schema";

/**
 * POST /api/resume/analyze
 * Accepts either a multipart file upload (field: resumeFile) or
 * resumeText in the JSON body — the frontend decides which based on
 * whether the user uploaded a file or pasted text.
 */
export const analyzeResume = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as AnalyzeRequestInput;

  let resumeText = body.resumeText;

  if (req.file) {
    resumeText = await extractResumeText({
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
    });
  }

  if (!resumeText || resumeText.trim().length < 50) {
    throw ApiError.badRequest("Please upload a resume file or paste your resume text.");
  }

  const analysis = await analyzeResumeWithGemini(
    resumeText,
    body.jobDescription,
    body.options,
    body.candidateName
  );

  res.status(200).json({ success: true, data: analysis });
});

/**
 * POST /api/resume/pdf
 * Takes a previously generated analysis and streams back a PDF file.
 */
export const exportAnalysisPdf = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as PdfExportInput;
  const pdfBuffer = await generateAnalysisPdf(body.analysis, body.candidateName);

  res.status(200);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="resume-analysis-${Date.now()}.pdf"`
  );
  res.send(pdfBuffer);
});
