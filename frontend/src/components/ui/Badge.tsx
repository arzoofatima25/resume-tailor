import { ReactNode } from "react";

type Tone = "primary" | "success" | "warning" | "danger" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-success-500/15 dark:text-success-500",
  warning: "bg-amber-50 text-amber-700 dark:bg-warning-500/15 dark:text-warning-500",
  danger: "bg-rose-50 text-rose-700 dark:bg-danger-500/15 dark:text-danger-500",
  neutral: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
