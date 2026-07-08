import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ApiError } from "../utils/ApiError";
import { resumeAnalysisSchema } from "../validation/resume.schema";
import { AnalyzeOptions, ResumeAnalysis } from "../types";

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw ApiError.internal(
      "GEMINI_API_KEY is not configured on the server. Add it to your .env file."
    );
  }
  if (!client) client = new GoogleGenerativeAI(apiKey);
  return client;
}

// Gemini's responseSchema — mirrors validation/resume.schema.ts so the
// model is structurally constrained to return exactly what we expect.
const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    matchScore: { type: SchemaType.NUMBER },
    missingSkills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    improvedSummary: { type: SchemaType.STRING },
    improvedExperience: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          role: { type: SchemaType.STRING },
          bullets: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        },
        required: ["role", "bullets"],
      },
    },
    optimizedSkills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    atsSuggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    coverLetter: { type: SchemaType.STRING },
    strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    weaknesses: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    overallFeedback: { type: SchemaType.STRING },
  },
  required: [
    "matchScore",
    "missingSkills",
    "improvedSummary",
    "improvedExperience",
    "optimizedSkills",
    "atsSuggestions",
    "coverLetter",
    "strengths",
    "weaknesses",
    "overallFeedback",
  ],
};

function buildSystemInstruction(options: AnalyzeOptions): string {
  return `You are an expert ATS (Applicant Tracking System) recruiter and professional resume writer with 15+ years of experience across tech, finance, and healthcare hiring.

Your task: analyze the candidate's resume against a specific job description and return ONLY a single valid JSON object matching the required schema. No markdown, no code fences, no commentary before or after the JSON, no explanations outside the JSON fields themselves.

Rules for your analysis:
1. Be realistic and calibrated with matchScore (0-100). Do not default to high scores — score based on genuine keyword, skill, and experience alignment the way a real ATS + recruiter would.
2. missingSkills: list only skills/keywords that appear in the job description but are genuinely absent or weak in the resume.
3. improvedSummary: rewrite the resume's professional summary (2-4 sentences) to align with the job description, using honest claims grounded in the resume's actual content — never invent experience the candidate doesn't have.
4. improvedExperience: rewrite key resume bullet points to be action-oriented, quantified where plausible, and aligned with the job description's language. Group by role/title as it appears on the resume.
5. optimizedSkills: a reordered/refined skills list prioritizing what the job description cares about most, drawn from skills actually present or reasonably implied by the resume.
6. atsSuggestions: concrete, specific formatting/keyword/structure suggestions to pass ATS screening for this exact job description.
7. coverLetter: ${options.generateCoverLetter ? "write a concise, professional, tailored cover letter (3-4 short paragraphs) referencing specific details from both the resume and job description. Avoid generic filler." : "return an empty string since the candidate did not request a cover letter."}
8. strengths: genuine strengths of this resume relative to this specific job description.
9. weaknesses: honest gaps or weaknesses relative to this specific job description.
10. overallFeedback: 2-3 sentences of direct, actionable overall feedback.

Tone: professional, action-oriented, specific. Never use vague filler like "team player" or "hard worker" without evidence. Never fabricate employers, dates, degrees, or metrics not implied by the source resume.

Return ONLY the JSON object. Nothing else.`;
}

function buildUserPrompt(resumeText: string, jobDescription: string, candidateName?: string): string {
  return `CANDIDATE NAME: ${candidateName?.trim() || "Not provided"}

===== RESUME =====
${resumeText}

===== JOB DESCRIPTION =====
${jobDescription}

Analyze the resume against the job description and return the JSON object now.`;
}
function parseGeminiJson(raw: string) {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini response did not contain a JSON object");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}
/**
 * Calls Gemini with a strict JSON response schema and validates the
 * result again on our side with Zod before it ever reaches the client.
 * Retries once on a malformed/invalid response, since LLM JSON output
 * occasionally needs a nudge.
 */
export async function analyzeResumeWithGemini(
  resumeText: string,
  jobDescription: string,
  options: AnalyzeOptions,
  candidateName?: string
): Promise<ResumeAnalysis> {
  const genAI = getClient();
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: buildSystemInstruction(options),
    generationConfig: {
  responseMimeType: "application/json",
  responseSchema: responseSchema as never,
  temperature: 0.2,
  maxOutputTokens: 2048,
},
  });

  const prompt = buildUserPrompt(
  resumeText.slice(0, 12000),
  jobDescription.slice(0, 6000),
  candidateName
);

  let lastError: unknown;
  for (let attempt = 0; attempt < 1; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const raw = result.response.text();
      const parsed = parseGeminiJson(raw);
      const validated = resumeAnalysisSchema.parse(parsed);
      return applyOptionDefaults(validated, options);
    } catch (err) {
      console.error("Gemini analysis failed:", err);
      lastError = err;
    }
  }

  throw ApiError.upstream(
    "The AI service returned an unexpected response. Please try again.",
    lastError instanceof Error ? lastError.message : lastError
  );
}

/** Zero out sections the user explicitly did not request, for a cleaner UI. */
function applyOptionDefaults(analysis: ResumeAnalysis, options: AnalyzeOptions): ResumeAnalysis {
  return {
    ...analysis,
    coverLetter: options.generateCoverLetter ? analysis.coverLetter : "",
    missingSkills: options.suggestMissingSkills ? analysis.missingSkills : [],
    atsSuggestions: options.atsOptimization ? analysis.atsSuggestions : [],
    matchScore: options.calculateMatchScore ? analysis.matchScore : 0,
  };
}
