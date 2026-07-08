import { Check } from "lucide-react";
import { WizardStep } from "@/types";

const STEPS: { id: WizardStep; label: string }[] = [
  { id: "upload", label: "Resume" },
  { id: "job-description", label: "Job description" },
  { id: "options", label: "Options" },
  { id: "generate", label: "Generate" },
];

export function StepIndicator({ current }: { current: WizardStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isDone
                    ? "bg-success-500 text-white"
                    : isActive
                    ? "bg-gradient-brand text-white shadow-glow"
                    : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                }`}
              >
                {isDone ? <Check size={14} /> : index + 1}
              </span>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`h-px flex-1 ${isDone ? "bg-success-500" : "bg-slate-200 dark:bg-white/10"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
