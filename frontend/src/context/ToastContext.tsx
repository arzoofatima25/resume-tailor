import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from "lucide-react";

export type ToastVariant = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof Info; classes: string }> = {
  success: { icon: CheckCircle2, classes: "border-success-500/40 text-success-600 dark:text-success-500" },
  error: { icon: XCircle, classes: "border-danger-500/40 text-danger-600 dark:text-danger-500" },
  warning: { icon: AlertTriangle, classes: "border-warning-500/40 text-warning-600 dark:text-warning-500" },
  info: { icon: Info, classes: "border-primary-500/40 text-primary-600 dark:text-primary-400" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => {
            const { icon: Icon, classes } = VARIANT_STYLES[toast.variant];
            return (
              <motion.div
                key={toast.id}
                role="status"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.25 }}
                className={`glass ${classes} rounded-xl2 shadow-soft dark:shadow-soft-dark px-4 py-3 flex items-start gap-3`}
              >
                <Icon size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm text-slate-700 dark:text-slate-200 flex-1">{toast.message}</p>
                <button
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
