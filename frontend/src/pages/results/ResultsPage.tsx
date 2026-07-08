import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Copy, Download, FileText, RefreshCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressCircle } from "@/components/ui/ProgressCircle";
import { Tabs } from "@/components/ui/Tabs";
import { ResumeAnalysis } from "@/types";
import { downloadAnalysisPdf } from "@/services/resumeService";
import { useToast } from "@/context/ToastContext";

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const state = location.state as { analysis?: ResumeAnalysis; jobTitle?: string } | null;
  const analysis = state?.analysis;

  if (!analysis) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h2 className="font-display text-lg font-semibold">No results to show</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Run a new analysis to see your tailored results here.
        </p>
        <Button className="mt-4" onClick={() => navigate("/dashboard/tailor")}>
          Start a new tailor
        </Button>
      </Card>
    );
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard.`, "success");
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const blob = await downloadAnalysisPdf(analysis, state?.jobTitle);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume-analysis.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not generate PDF.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadText = () => {
    const content = [
      `MATCH SCORE: ${analysis.matchScore}/100`,
      "",
      "OVERALL FEEDBACK",
      analysis.overallFeedback,
      "",
      "IMPROVED SUMMARY",
      analysis.improvedSummary,
      "",
      "STRENGTHS",
      ...analysis.strengths.map((s) => `- ${s}`),
      "",
      "WEAKNESSES",
      ...analysis.weaknesses.map((s) => `- ${s}`),
      "",
      "MISSING SKILLS",
      analysis.missingSkills.join(", "),
      "",
      "ATS SUGGESTIONS",
      ...analysis.atsSuggestions.map((s) => `- ${s}`),
      "",
      "COVER LETTER",
      analysis.coverLetter,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume-analysis.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-bold">{state?.jobTitle || "Your tailored results"}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Generated just now</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" icon={<FileText size={16} />} onClick={downloadText}>
            Download text
          </Button>
          <Button size="sm" icon={<Download size={16} />} isLoading={isDownloading} onClick={handleDownloadPdf}>
            Download PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCcw size={16} />}
            onClick={() => navigate("/dashboard/tailor")}
          >
            Regenerate
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card animate className="flex flex-col items-center justify-center text-center">
          <ProgressCircle score={analysis.matchScore} />
          <div className="mt-4 flex gap-2">
            <Badge tone={analysis.matchScore >= 70 ? "success" : analysis.matchScore >= 50 ? "warning" : "danger"}>
              {analysis.matchScore >= 70 ? "Strong match" : analysis.matchScore >= 50 ? "Moderate match" : "Needs work"}
            </Badge>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{analysis.overallFeedback}</p>
        </Card>

        <div className="space-y-6">
          <Card animate>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 font-display font-semibold text-success-600 dark:text-success-500">
                  <ThumbsUp size={16} /> Strengths
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                  {analysis.strengths.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-display font-semibold text-danger-600 dark:text-danger-500">
                  <ThumbsDown size={16} /> Weaknesses
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                  {analysis.weaknesses.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {analysis.missingSkills.length > 0 && (
            <Card animate>
              <h3 className="font-display font-semibold">Missing skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill) => (
                  <Badge key={skill} tone="danger">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {analysis.optimizedSkills.length > 0 && (
            <Card animate>
              <h3 className="font-display font-semibold">Optimized skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.optimizedSkills.map((skill) => (
                  <Badge key={skill} tone="primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <Card animate>
        <Tabs
          tabs={[
            {
              id: "summary",
              label: "Summary",
              content: (
                <SectionWithCopy text={analysis.improvedSummary} onCopy={() => copyToClipboard(analysis.improvedSummary, "Summary")} />
              ),
            },
            {
              id: "experience",
              label: "Experience",
              content: (
                <div className="space-y-4">
                  {analysis.improvedExperience.map((block, i) => (
                    <div key={i}>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{block.role}</p>
                      <ul className="mt-1.5 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                        {block.bullets.map((bullet, bi) => (
                          <li key={bi}>• {bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              id: "ats",
              label: "ATS suggestions",
              content: (
                <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                  {analysis.atsSuggestions.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              ),
            },
            {
              id: "cover-letter",
              label: "Cover letter",
              content: analysis.coverLetter ? (
                <SectionWithCopy text={analysis.coverLetter} onCopy={() => copyToClipboard(analysis.coverLetter, "Cover letter")} multiline />
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Cover letter generation wasn't selected for this analysis.
                </p>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

function SectionWithCopy({ text, onCopy, multiline }: { text: string; onCopy: () => void; multiline?: boolean }) {
  return (
    <div>
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" icon={<Copy size={14} />} onClick={onCopy}>
          Copy
        </Button>
      </div>
      <p className={`text-sm text-slate-600 dark:text-slate-400 ${multiline ? "whitespace-pre-line" : ""}`}>{text}</p>
    </div>
  );
}
