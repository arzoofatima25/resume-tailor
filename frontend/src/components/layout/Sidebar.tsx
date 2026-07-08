import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileStack, Sparkles, Settings, X } from "lucide-react";
import { APP_NAME } from "@/constants";

const LINKS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/tailor", label: "New Tailor", icon: Sparkles, end: false },
  { to: "/dashboard/history", label: "History", icon: FileStack, end: false },
  { to: "/dashboard/settings", label: "Settings", icon: Settings, end: false },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform border-r border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark-raised transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white">
              <Sparkles size={16} />
            </span>
            {APP_NAME}
          </span>
          <button className="lg:hidden text-slate-400" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gradient-brand text-white shadow-glow"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
