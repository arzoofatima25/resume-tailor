import mammoth from "mammoth";
// pdf-parse has no default ESM export typing; require keeps it simple under CommonJS output.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require("pdf-parse");
import { ApiError } from "../utils/ApiError";

interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

/**
 * Extracts plain text from a resume file regardless of its format.
 * Keeping this isolated means adding a new supported format later
 * (e.g. RTF) only touches this file.
 */
export async function extractResumeText(file: UploadedFile): Promise<string> {
  try {
    switch (file.mimetype) {
      case "application/pdf": {
        const { text } = await pdfParse(file.buffer);
        return normalize(text);
      }
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        const { value } = await mammoth.extractRawText({ buffer: file.buffer });
        return normalize(value);
      }
      case "text/plain": {
        return normalize(file.buffer.toString("utf-8"));
      }
      default:
        throw ApiError.unsupportedMedia("Unsupported resume file type.");
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.badRequest(
      `Could not read "${file.originalname}". The file may be corrupted or password-protected.`
    );
  }
}

function normalize(text: string): string {
  const cleaned = text.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").trim();
  if (cleaned.length < 30) {
    throw ApiError.badRequest(
      "We couldn't find enough readable text in that file. Try pasting your resume text instead."
    );
  }
  return cleaned;
}
