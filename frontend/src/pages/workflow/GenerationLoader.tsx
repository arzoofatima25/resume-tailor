import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SkeletonBlock } from "@/components/ui/Skeleton";

const STATUS_MESSAGES = [
  "Reading your resume...",
  "Comparing against the job description...",
  "Scoring keyword alignment...",
  "Rewriting your summary...",
  "Drafting your cover letter...",
  "Finalizing suggestions...",
];

export function GenerationLoader() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => Math.min(i + 1, STATUS_MESSAGES.length - 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto max-w-xl text-center">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow"
      >
        <Sparkles size={28} />
      </motion.div>
      <p className="mt-5 font-display text-lg font-semibold" aria-live="polite">
        {STATUS_MESSAGES[statusIndex]}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This usually takes 15–30 seconds.</p>

      <div className="mt-8 space-y-4 text-left">
        <SkeletonBlock lines={2} />
        <SkeletonBlock lines={3} />
        <SkeletonBlock lines={2} />
      </div>
    </div>
  );
}
