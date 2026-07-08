import { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("Uncaught application error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-light dark:bg-surface-dark px-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-500/10 text-danger-500">
            <AlertTriangle size={28} />
          </div>
          <h1 className="font-display text-xl font-bold">Something went wrong</h1>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            An unexpected error occurred. Try reloading the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
