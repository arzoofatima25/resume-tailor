import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white shadow-glow hover:brightness-110 active:brightness-95 disabled:opacity-60",
  secondary:
    "bg-primary-50 text-primary-700 dark:bg-white/10 dark:text-primary-200 hover:bg-primary-100 dark:hover:bg-white/20",
  outline:
    "border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5",
  ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10",
  danger: "bg-danger-500 text-white hover:bg-danger-600",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-xl gap-2",
  lg: "text-base px-6 py-3.5 rounded-xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", isLoading, icon, disabled, className = "", children, ...rest },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-primary-500 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
        {...rest}
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
