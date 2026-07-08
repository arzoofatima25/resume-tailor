export interface AnalyzeOptions {
  improveSummary: boolean;
  improveExperience: boolean;
  generateCoverLetter: boolean;
  suggestMissingSkills: boolean;
  calculateMatchScore: boolean;
  atsOptimization: boolean;
}

export interface ExperienceBullet {
  role: string;
  bullets: string[];
}

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

export interface HistoryEntry {
  id: string;
  createdAt: string;
  jobTitle: string;
  candidateName?: string;
  matchScore: number;
  favorite: boolean;
  analysis: ResumeAnalysis;
}

export type ThemeMode = "light" | "dark";

export type WizardStep = "upload" | "job-description" | "options" | "generate";
