import { z } from "zod";

export const analyzeOptionsSchema = z.object({
  improveSummary: z.boolean().default(true),
  improveExperience: z.boolean().default(true),
  generateCoverLetter: z.boolean().default(true),
  suggestMissingSkills: z.boolean().default(true),
  calculateMatchScore: z.boolean().default(true),
  atsOptimization: z.boolean().default(true),
});

export const analyzeRequestSchema = z.object({
  // Optional here because a file upload (handled separately by multer)
  // is an equally valid source of resume text — the controller enforces
  // that at least one of the two is present.
  resumeText: z
    .string()
    .trim()
    .max(20000, "Resume text is too long (20,000 character limit).")
    .optional()
    .default(""),
  jobDescription: z
    .string({ required_error: "Job description is required." })
    .trim()
    .min(50, "Job description looks too short — please paste the full posting.")
    .max(10000, "Job description is too long (10,000 character limit)."),
  options: analyzeOptionsSchema.default({
    improveSummary: true,
    improveExperience: true,
    generateCoverLetter: true,
    suggestMissingSkills: true,
    calculateMatchScore: true,
    atsOptimization: true,
  }),
  candidateName: z.string().trim().max(100).optional(),
});

const experienceBulletSchema = z.object({
  role: z.string(),
  bullets: z.array(z.string()),
});

export const resumeAnalysisSchema = z.object({
  matchScore: z.number().min(0).max(100),
  missingSkills: z.array(z.string()),
  improvedSummary: z.string(),
  improvedExperience: z.array(experienceBulletSchema),
  optimizedSkills: z.array(z.string()),
  atsSuggestions: z.array(z.string()),
  coverLetter: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  overallFeedback: z.string(),
});

export const pdfExportSchema = z.object({
  candidateName: z.string().trim().max(100).optional(),
  analysis: resumeAnalysisSchema,
});

export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;
export type PdfExportInput = z.infer<typeof pdfExportSchema>;
