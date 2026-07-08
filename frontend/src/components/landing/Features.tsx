import { BarChart3, FileCheck2, ListChecks, Mail, ScanSearch, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Match score",
    description: "See exactly how well your resume aligns with a job before you apply.",
  },
  {
    icon: Sparkles,
    title: "AI-rewritten summary",
    description: "Your professional summary rewritten to speak directly to the role.",
  },
  {
    icon: ListChecks,
    title: "Sharper experience bullets",
    description: "Action-oriented, quantified bullet points aligned to the posting.",
  },
  {
    icon: ScanSearch,
    title: "Missing skills detector",
    description: "Spot the keywords the job wants that your resume doesn't have yet.",
  },
  {
    icon: FileCheck2,
    title: "ATS optimization",
    description: "Formatting and keyword guidance so you clear automated screens.",
  },
  {
    icon: Mail,
    title: "Tailored cover letter",
    description: "A ready-to-send cover letter grounded in your real experience.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything you need to apply with confidence</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          One analysis, six outputs — all generated from a single resume and job description.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} hover animate>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white">
              <feature.icon size={20} />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
