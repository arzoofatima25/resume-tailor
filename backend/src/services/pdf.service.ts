import PDFDocument from "pdfkit";
import { ResumeAnalysis } from "../types";

const COLORS = {
  primary: "#4F46E5", // indigo
  accent: "#06B6D4", // cyan
  text: "#1F2937",
  muted: "#6B7280",
  line: "#E5E7EB",
};

/**
 * Streams a formatted PDF report (score, summary, skills, experience,
 * ATS suggestions, cover letter) and resolves with the full buffer.
 */
export function generateAnalysisPdf(
  analysis: ResumeAnalysis,
  candidateName?: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawHeader(doc, candidateName);
    drawScore(doc, analysis.matchScore);
    drawSection(doc, "Overall Feedback", [analysis.overallFeedback]);
    drawSection(doc, "Strengths", analysis.strengths);
    drawSection(doc, "Weaknesses", analysis.weaknesses);
    drawSection(doc, "Improved Summary", [analysis.improvedSummary]);
    drawExperience(doc, analysis.improvedExperience);
    drawSection(doc, "Optimized Skills", [analysis.optimizedSkills.join("  •  ")]);
    drawSection(doc, "Missing Skills", [analysis.missingSkills.join("  •  ")]);
    drawSection(doc, "ATS Suggestions", analysis.atsSuggestions);
    if (analysis.coverLetter?.trim()) {
      drawSection(doc, "Cover Letter", [analysis.coverLetter]);
    }

    addPageNumbers(doc);
    doc.end();
  });
}

function drawHeader(doc: PDFKit.PDFDocument, candidateName?: string) {
  doc
    .fillColor(COLORS.primary)
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("AI Resume & Cover Letter Report", { align: "left" });

  if (candidateName) {
    doc.moveDown(0.2).fillColor(COLORS.muted).fontSize(11).font("Helvetica").text(candidateName);
  }

  doc
    .moveDown(0.2)
    .fillColor(COLORS.muted)
    .fontSize(9)
    .text(`Generated on ${new Date().toLocaleDateString()}`);

  doc.moveDown(0.6);
  drawDivider(doc);
}

function drawScore(doc: PDFKit.PDFDocument, score: number) {
  doc.moveDown(0.6);
  doc.fillColor(COLORS.text).fontSize(13).font("Helvetica-Bold").text("Match Score");
  doc.moveDown(0.2);
  doc
    .fillColor(COLORS.accent)
    .fontSize(28)
    .font("Helvetica-Bold")
    .text(`${Math.round(score)} / 100`);
  doc.moveDown(0.5);
  drawDivider(doc);
}

function drawSection(doc: PDFKit.PDFDocument, title: string, items: string[]) {
  const content = items.filter((i) => i && i.trim().length > 0);
  if (content.length === 0) return;

  doc.moveDown(0.7);
  doc.fillColor(COLORS.primary).fontSize(13).font("Helvetica-Bold").text(title);
  doc.moveDown(0.3);
  doc.fillColor(COLORS.text).fontSize(10.5).font("Helvetica");

  content.forEach((item) => {
    if (content.length > 1) {
      doc.text(`•  ${item}`, { indent: 10, lineGap: 3 });
    } else {
      doc.text(item, { lineGap: 3 });
    }
  });
}

function drawExperience(
  doc: PDFKit.PDFDocument,
  experience: ResumeAnalysis["improvedExperience"]
) {
  if (!experience?.length) return;
  doc.moveDown(0.7);
  doc.fillColor(COLORS.primary).fontSize(13).font("Helvetica-Bold").text("Experience Improvements");

  experience.forEach((block) => {
    doc.moveDown(0.3);
    doc.fillColor(COLORS.text).fontSize(11).font("Helvetica-Bold").text(block.role);
    doc.fillColor(COLORS.text).fontSize(10.5).font("Helvetica");
    block.bullets.forEach((bullet) => {
      doc.text(`•  ${bullet}`, { indent: 10, lineGap: 3 });
    });
  });
}

function drawDivider(doc: PDFKit.PDFDocument) {
  const y = doc.y;
  doc
    .strokeColor(COLORS.line)
    .lineWidth(1)
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .stroke();
  doc.moveDown(0.4);
}

function addPageNumbers(doc: PDFKit.PDFDocument) {
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc
      .fillColor(COLORS.muted)
      .fontSize(8)
      .text(`Page ${i + 1} of ${range.count}`, 0, doc.page.height - 40, {
        align: "center",
      });
  }
}
