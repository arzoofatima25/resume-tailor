import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileStack, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useHistory } from "@/hooks/useHistory";
import { useAuth } from "@/context/AuthContext";

const STATS = [
  { label: "Analyses run", icon: Sparkles, value: (n: number) => n },
  { label: "Avg. match score", icon: TrendingUp, value: (n: number) => `${n}%` },
  { label: "Favorites saved", icon: FileStack, value: (n: number) => n },
];

export function DashboardOverview() {
  const { history } = useHistory();
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0];

  const avgScore = history.length
    ? Math.round(history.reduce((sum, h) => sum + h.matchScore, 0) / history.length)
    : 0;
  const favorites = history.filter((h) => h.favorite).length;
  const statValues = [history.length, avgScore, favorites];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 rounded-xl2 bg-gradient-brand p-6 text-white sm:flex-row sm:items-center"
      >
        <div>
          <h2 className="font-display text-xl font-bold">
            {firstName ? `Welcome back, ${firstName} 👋` : "Ready to tailor your next application?"}
          </h2>
          <p className="mt-1 text-sm text-white/85">Upload a resume and a job description to get started.</p>
        </div>
        <Link to="/dashboard/tailor">
          <Button variant="secondary" className="bg-white text-primary-700 hover:bg-white/90" icon={<Zap size={16} />}>
            New tailor
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <Card key={stat.label} animate>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-300">
                <stat.icon size={18} />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">{stat.value(statValues[i])}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Recent analyses</h3>
          <Link to="/dashboard/history" className="text-sm font-medium text-primary-600 dark:text-primary-400">
            View all
          </Link>
        </div>

        {history.length === 0 ? (
          <Card className="text-center text-sm text-slate-500 dark:text-slate-400">
            No analyses yet. Run your first tailor to see it here.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {history.slice(0, 3).map((entry) => (
              <Card key={entry.id} hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{entry.jobTitle}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge tone={entry.matchScore >= 70 ? "success" : entry.matchScore >= 50 ? "warning" : "danger"}>
                    {entry.matchScore}%
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
