import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressCircle } from "@/components/ui/ProgressCircle";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-mesh pt-16 pb-24 sm:pt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge tone="primary">
            <Sparkles size={12} className="mr-1 inline" /> Powered by Gemini AI
          </Badge>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Tailor your resume to{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">every job</span>, in
            seconds
          </h1>
          <p className="mt-5 max-w-lg text-lg text-slate-600 dark:text-slate-400">
            Paste a job description, upload your resume, and get an ATS-ready rewrite, a match
            score, and a tailored cover letter — all backed by AI that reads job postings like a
            recruiter does.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" icon={<ArrowRight size={18} />} onClick={() => navigate("/signup")}>
              Tailor my resume free
            </Button>
            <Button size="lg" variant="outline" icon={<Play size={16} />} onClick={() => navigate("/login")}>
              See a live demo
            </Button>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
            No credit card required · Free match-score check
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative flex justify-center"
        >
          <div className="glass relative w-full max-w-sm rounded-xl2 p-8 shadow-glow">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Live analysis preview</p>
            <div className="mt-6 flex justify-center">
              <ProgressCircle score={87} />
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Missing skills found</span>
                <span className="font-semibold text-danger-500">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">ATS suggestions</span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">6</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Cover letter</span>
                <span className="font-semibold text-success-500">Ready</span>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-6 -top-6 hidden rounded-xl2 bg-white dark:bg-surface-dark-raised px-4 py-3 shadow-soft dark:shadow-soft-dark sm:block"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">Time saved</p>
            <p className="font-display text-xl font-bold text-primary-600 dark:text-primary-400">~2 hrs</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
