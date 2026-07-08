import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/constants";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-mesh px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md rounded-xl2 p-8 shadow-soft dark:shadow-soft-dark"
      >
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white">
            <Sparkles size={16} />
          </span>
          {APP_NAME}
        </Link>
        <h1 className="mt-6 font-display text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">{footer}</p>
      </motion.div>
    </div>
  );
}
