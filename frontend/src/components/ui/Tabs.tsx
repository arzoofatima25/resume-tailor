import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ tabs, defaultTabId }: { tabs: Tab[]; defaultTabId?: string }) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeId);

  return (
    <div>
      <div role="tablist" className="flex gap-1 rounded-xl bg-slate-100 dark:bg-white/5 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeId === tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors focus-visible:outline-primary-500 ${
              activeId === tab.id ? "text-white" : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {activeId === tab.id && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-lg bg-gradient-brand"
                transition={{ type: "spring", duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-4">{active?.content}</div>
    </div>
  );
}
