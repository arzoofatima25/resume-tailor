import { AlertTriangle } from "lucide-react";

export function AuthConfigNotice() {
  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-warning-500/30 bg-warning-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
      <p>
        Firebase isn&apos;t configured yet. Add your project keys to{" "}
        <code className="rounded bg-black/10 dark:bg-white/10 px-1 py-0.5">frontend/.env</code> to enable
        real sign-in.
      </p>
    </div>
  );
}
