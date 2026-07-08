import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gradient-mesh px-4 text-center">
      <p className="font-display text-6xl font-bold bg-gradient-brand bg-clip-text text-transparent">404</p>
      <h1 className="font-display text-xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/">
        <Button className="mt-2">Back to home</Button>
      </Link>
    </div>
  );
}
