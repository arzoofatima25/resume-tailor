import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative flex h-9 w-16 items-center rounded-full bg-slate-200 dark:bg-white/10 px-1 transition-colors focus-visible:outline-primary-500"
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-surface-dark-raised shadow-soft transition-transform duration-300 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon size={14} className="text-primary-400" /> : <Sun size={14} className="text-amber-500" />}
      </span>
    </button>
  );
}
