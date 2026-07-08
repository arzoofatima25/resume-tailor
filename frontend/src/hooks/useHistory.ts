import { useCallback, useEffect, useState } from "react";
import { HISTORY_STORAGE_KEY } from "@/constants";
import { HistoryEntry, ResumeAnalysis } from "@/types";

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      setHistory([]);
    }
  }, []);

  const persist = useCallback((next: HistoryEntry[]) => {
    setHistory(next);
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addEntry = useCallback(
    (analysis: ResumeAnalysis, jobTitle: string, candidateName?: string) => {
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        jobTitle: jobTitle || "Untitled role",
        candidateName,
        matchScore: analysis.matchScore,
        favorite: false,
        analysis,
      };
      persist([entry, ...history].slice(0, 50));
      return entry;
    },
    [history, persist]
  );

  const removeEntry = useCallback(
    (id: string) => persist(history.filter((h) => h.id !== id)),
    [history, persist]
  );

  const toggleFavorite = useCallback(
    (id: string) =>
      persist(history.map((h) => (h.id === id ? { ...h, favorite: !h.favorite } : h))),
    [history, persist]
  );

  return { history, addEntry, removeEntry, toggleFavorite };
}
