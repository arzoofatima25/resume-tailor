import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowRight, RefreshCcw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { StepIndicator } from "./StepIndicator";
import { GenerationLoader } from "./GenerationLoader";
import { DEFAULT_OPTIONS, MAX_JOB_DESCRIPTION_CHARS, MAX_RESUME_CHARS, OPTION_META } from "@/constants";
import { AnalyzeOptions, WizardStep } from "@/types";
import { analyzeResume } from "@/services/resumeService";
import { useHistory } from "@/hooks/useHistory";
import { useToast } from "@/context/ToastContext";

export function TailorWizard() {
  const navigate = useNavigate();
  const { addEntry } = useHistory();
  const { showToast } = useToast();

  const [step, setStep] = useState<WizardStep>("upload");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [options, setOptions] = useState<AnalyzeOptions>(DEFAULT_OPTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasResume = Boolean(resumeFile || resumeText.trim().length >= 50);
  const hasJobDescription = jobDescription.trim().length >= 50;

  const goNext = () => {
    if (step === "upload") setStep("job-description");
    else if (step === "job-description") setStep("options");
    else if (step === "options") setStep("generate");
  };

  const goBack = () => {
    if (step === "job-description") setStep("upload");
    else if (step === "options") setStep("job-description");
    else if (step === "generate" && !isGenerating) setStep("options");
  };

  const runGeneration = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const analysis = await analyzeResume({
        resumeFile,
        resumeText: resumeFile ? undefined : resumeText,
        jobDescription,
        options,
      });
      addEntry(analysis, jobTitle || "Untitled role");
      navigate("/dashboard/results", { state: { analysis, jobTitle } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      showToast("Generation failed — see details below.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <StepIndicator current={step} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {step === "upload" && (
            <Card>
              <h2 className="font-display text-lg font-semibold">Upload your resume</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Upload a file, or paste your resume text below.
              </p>
              <div className="mt-5">
                <FileUpload file={resumeFile} onFileSelect={setResumeFile} />
              </div>
              {!resumeFile && (
                <div className="mt-4">
                  <label htmlFor="resume-text" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Or paste resume text
                  </label>
                  <textarea
                    id="resume-text"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value.slice(0, MAX_RESUME_CHARS))}
                    rows={8}
                    placeholder="Paste your resume text here..."
                    className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 p-3 text-sm focus-visible:outline-primary-500"
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {resumeText.length}/{MAX_RESUME_CHARS}
                  </p>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <Button onClick={goNext} disabled={!hasResume} icon={<ArrowRight size={16} />}>
                  Continue
                </Button>
              </div>
            </Card>
          )}

          {step === "job-description" && (
            <Card>
              <h2 className="font-display text-lg font-semibold">Paste the job description</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                The more complete the posting, the better the analysis.
              </p>
              <div className="mt-5">
                <label htmlFor="job-title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Job title (optional, helps organize your history)
                </label>
                <input
                  id="job-title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer at Acme Co."
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2.5 text-sm focus-visible:outline-primary-500"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="job-description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Job description
                </label>
                <textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value.slice(0, MAX_JOB_DESCRIPTION_CHARS))}
                  rows={10}
                  placeholder="Paste the full job posting here..."
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 p-3 text-sm focus-visible:outline-primary-500"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {jobDescription.length}/{MAX_JOB_DESCRIPTION_CHARS}
                </p>
                {jobDescription.length > 0 && jobDescription.trim().length < 50 && (
                  <p className="mt-1 text-xs text-danger-500">
                    Add a bit more detail — at least 50 characters.
                  </p>
                )}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={goBack} icon={<ArrowLeft size={16} />}>
                  Back
                </Button>
                <Button onClick={goNext} disabled={!hasJobDescription} icon={<ArrowRight size={16} />}>
                  Continue
                </Button>
              </div>
            </Card>
          )}

          {step === "options" && (
            <Card>
              <h2 className="font-display text-lg font-semibold">Choose what to generate</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select any combination.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {OPTION_META.map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl2 border p-4 transition-colors ${
                      options[opt.key]
                        ? "border-primary-400 bg-primary-50/50 dark:bg-primary-500/10"
                        : "border-slate-200 dark:border-white/10"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={options[opt.key]}
                      onChange={(e) => setOptions((prev) => ({ ...prev, [opt.key]: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 accent-primary-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{opt.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{opt.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={goBack} icon={<ArrowLeft size={16} />}>
                  Back
                </Button>
                <Button onClick={goNext} icon={<Sparkles size={16} />}>
                  Review &amp; generate
                </Button>
              </div>
            </Card>
          )}

          {step === "generate" && (
            <Card>
              {isGenerating ? (
                <GenerationLoader />
              ) : error ? (
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-500/10 text-danger-500">
                    <AlertTriangle size={26} />
                  </div>
                  <h2 className="mt-4 font-display text-lg font-semibold">Generation failed</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{error}</p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Button variant="outline" onClick={goBack} icon={<ArrowLeft size={16} />}>
                      Back
                    </Button>
                    <Button onClick={runGeneration} icon={<RefreshCcw size={16} />}>
                      Retry
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="font-display text-lg font-semibold">Ready to generate</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    We'll analyze your resume against the job description now.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Button variant="outline" onClick={goBack} icon={<ArrowLeft size={16} />}>
                      Back
                    </Button>
                    <Button onClick={runGeneration} icon={<Sparkles size={16} />}>
                      Generate analysis
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
