import { motion } from "framer-motion";
import { FileUp, ListChecks, SlidersHorizontal, Sparkles } from "lucide-react";

const STEPS = [
  { icon: FileUp, title: "Upload your resume", description: "PDF, DOCX, or paste the text directly." },
  { icon: ListChecks, title: "Paste the job description", description: "Drop in the full posting you're applying to." },
  { icon: SlidersHorizontal, title: "Choose what to generate", description: "Pick a match score, ATS tips, cover letter, or all of it." },
  { icon: Sparkles, title: "Get your tailored results", description: "Review, copy, or export everything as a PDF." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 dark:bg-white/[0.02] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">How it works</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Four steps from resume to ready-to-send application.</p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-primary-500">0{index + 1}</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              </div>
              <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-surface-dark-raised border border-slate-200 dark:border-white/10 text-primary-600 dark:text-primary-400 shadow-soft dark:shadow-soft-dark">
                <step.icon size={20} />
              </div>
              <h3 className="mt-4 font-display font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
