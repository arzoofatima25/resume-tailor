import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ProgressCircleProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

function toneForScore(score: number) {
  if (score >= 80) return { from: "#10b981", to: "#06b6d4" };
  if (score >= 55) return { from: "#f59e0b", to: "#06b6d4" };
  return { from: "#f43f5e", to: "#f59e0b" };
}

export function ProgressCircle({ score, size = 160, strokeWidth = 12, label = "Match Score" }: ProgressCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const tone = toneForScore(score);
  const gradientId = `score-gradient-${label.replace(/\s+/g, "-")}`;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimatedScore(score));
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="relative inline-flex flex-col items-center justify-center" role="img" aria-label={`${label}: ${score} out of 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tone.from} />
            <stop offset="100%" stopColor={tone.to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-slate-100 dark:stroke-white/10"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={`url(#${gradientId})`}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-bold text-slate-900 dark:text-white">
          {Math.round(animatedScore)}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      </div>
    </div>
  );
}
