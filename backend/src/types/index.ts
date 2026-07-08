export interface AnalyzeOptions {
  improveSummary: boolean;
  improveExperience: boolean;
  generateCoverLetter: boolean;
  suggestMissingSkills: boolean;
  calculateMatchScore: boolean;
  atsOptimization: boolean;
}

export interface AnalyzeRequestBody {
  resumeText: string;
  jobDescription: string;
  options: AnalyzeOptions;
  candidateName?: string;
}

/**
 * Shape of the structured JSON we require Gemini to return.
 * Every field is always present so the frontend never has to
 * guard against missing keys — optional sections are simply
 * empty arrays / strings / zero when not requested.
 */
export interface ResumeAnalysis {
  matchScore: number;
  missingSkills: string[];
  improvedSummary: string;
  improvedExperience: ExperienceBullet[];
  optimizedSkills: string[];
  atsSuggestions: string[];
  coverLetter: string;
  strengths: string[];
  weaknesses: string[];
  overallFeedback: string;
}

export interface ExperienceBullet {
  role: string;
  bullets: string[];
}

export interface PdfExportBody {
  candidateName?: string;
  analysis: ResumeAnalysis;
}
