import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useHistory } from "@/hooks/useHistory";

export function HistoryPage() {
  const { history, removeEntry, toggleFavorite } = useHistory();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(
    () => history.filter((h) => h.jobTitle.toLowerCase().includes(query.toLowerCase())),
    [history, query]
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search history by job title..."
          aria-label="Search history"
          className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 py-2.5 pl-9 pr-3 text-sm focus-visible:outline-primary-500"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center text-sm text-slate-500 dark:text-slate-400">
          {history.length === 0 ? "No analyses yet." : "No results match your search."}
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-slate-200 dark:border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/5 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Job title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Match score</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <button
                      className="font-medium text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400"
                      onClick={() => navigate("/dashboard/results", { state: { analysis: entry.analysis, jobTitle: entry.jobTitle } })}
                    >
                      {entry.jobTitle}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={entry.matchScore >= 70 ? "success" : entry.matchScore >= 50 ? "warning" : "danger"}>
                      {entry.matchScore}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={entry.favorite ? "Unfavorite" : "Favorite"}
                        onClick={() => toggleFavorite(entry.id)}
                      >
                        <Star size={16} className={entry.favorite ? "fill-amber-400 text-amber-400" : ""} />
                      </Button>
                      <Button variant="ghost" size="sm" aria-label="Delete" onClick={() => removeEntry(entry.id)}>
                        <Trash2 size={16} className="text-danger-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
