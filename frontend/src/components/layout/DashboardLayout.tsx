import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/tailor": "New Tailor",
  "/dashboard/history": "History",
  "/dashboard/settings": "Settings",
};

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
