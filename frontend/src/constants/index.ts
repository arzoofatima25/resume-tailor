import { AnalyzeOptions } from "@/types";

export const APP_NAME = "Tailorly";

export const MAX_RESUME_CHARS = 20000;
export const MAX_JOB_DESCRIPTION_CHARS = 10000;
export const MAX_UPLOAD_MB = 5;
export const ACCEPTED_FILE_TYPES = [".pdf", ".docx", ".txt"];

export const DEFAULT_OPTIONS: AnalyzeOptions = {
  improveSummary: true,
  improveExperience: true,
  generateCoverLetter: true,
  suggestMissingSkills: true,
  calculateMatchScore: true,
  atsOptimization: true,
};

export const OPTION_META: { key: keyof AnalyzeOptions; label: string; description: string }[] = [
  {
    key: "calculateMatchScore",
    label: "Calculate match score",
    description: "Score how well your resume aligns with this job.",
  },
  {
    key: "improveSummary",
    label: "Improve summary",
    description: "Rewrite your professional summary for this role.",
  },
  {
    key: "improveExperience",
    label: "Improve experience",
    description: "Sharpen bullet points with action verbs and impact.",
  },
  {
    key: "suggestMissingSkills",
    label: "Suggest missing skills",
    description: "Surface keywords the job wants that your resume lacks.",
  },
  {
    key: "atsOptimization",
    label: "ATS optimization",
    description: "Get formatting and keyword tips to pass ATS screening.",
  },
  {
    key: "generateCoverLetter",
    label: "Generate cover letter",
    description: "Draft a tailored cover letter for this application.",
  },
];

export const HISTORY_STORAGE_KEY = "tailorly_history_v1";
export const THEME_STORAGE_KEY = "tailorly_theme";
