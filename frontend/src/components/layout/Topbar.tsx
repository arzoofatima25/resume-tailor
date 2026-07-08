import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

function getInitials(name?: string | null, email?: string | null) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return (email?.[0] ?? "?").toUpperCase();
}

export function Topbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Account";

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    showToast("You've been logged out.", "info");
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-surface-dark/80 backdrop-blur px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-slate-500" onClick={onMenuClick} aria-label="Open sidebar">
          <Menu size={22} />
        </button>
        <h1 className="font-display text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeSwitch />
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 py-1 pl-1 pr-2"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                referrerPolicy="no-referrer"
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-xs font-semibold text-white">
                {getInitials(user?.displayName, user?.email)}
              </span>
            )}
            <span className="hidden max-w-[8rem] truncate text-sm font-medium text-slate-700 dark:text-slate-200 sm:inline">
              {displayName}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-xl2 border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark-raised p-1.5 shadow-soft dark:shadow-soft-dark"
              >
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{displayName}</p>
                  {user?.email && (
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  )}
                </div>
                <div className="my-1 h-px bg-slate-100 dark:bg-white/10" />
                <button
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/dashboard/settings");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <User size={16} /> Profile
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/dashboard/settings");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <Settings size={16} /> Settings
                </button>
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger-500 hover:bg-danger-500/10"
                >
                  <LogOut size={16} /> Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
