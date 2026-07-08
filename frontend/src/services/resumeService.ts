import { api } from "./api";
import { AnalyzeOptions, ResumeAnalysis } from "@/types";

interface AnalyzeParams {
  resumeText?: string;
  resumeFile?: File | null;
  jobDescription: string;
  options: AnalyzeOptions;
  candidateName?: string;
}

export async function analyzeResume({
  resumeText,
  resumeFile,
  jobDescription,
  options,
  candidateName,
}: AnalyzeParams): Promise<ResumeAnalysis> {
  if (resumeFile) {
    const form = new FormData();
    form.append("resumeFile", resumeFile);
    form.append("jobDescription", jobDescription);
    form.append("options", JSON.stringify(options));
    if (candidateName) form.append("candidateName", candidateName);

    const { data } = await api.post("/resume/analyze", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data as ResumeAnalysis;
  }

  const { data } = await api.post("/resume/analyze", {
    resumeText,
    jobDescription,
    options,
    candidateName,
  });
  return data.data as ResumeAnalysis;
}

export async function downloadAnalysisPdf(
  analysis: ResumeAnalysis,
  candidateName?: string
): Promise<Blob> {
  const { data } = await api.post(
    "/resume/pdf",
    { analysis, candidateName },
    { responseType: "blob" }
  );
  return data as Blob;
}
