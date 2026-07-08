import { HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glass?: boolean;
  hover?: boolean;
  animate?: boolean;
}

export function Card({ children, glass = false, hover = false, animate = false, className = "", ...rest }: CardProps) {
  const base = `rounded-xl2 border p-6 ${
    glass
      ? "glass shadow-soft dark:shadow-soft-dark"
      : "bg-white dark:bg-surface-dark-raised border-slate-200 dark:border-white/10 shadow-soft dark:shadow-soft-dark"
  } ${hover ? "transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow" : ""} ${className}`;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={base}
        {...(rest as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={base} {...rest}>
      {children}
    </div>
  );
}
