import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Spinner } from "@/components/ui/Spinner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const LandingPage = lazy(() => import("@/pages/LandingPage").then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage").then((m) => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import("@/pages/auth/SignupPage").then((m) => ({ default: m.SignupPage })));
const ForgotPasswordPage = lazy(() =>
  import("@/pages/auth/ForgotPasswordPage").then((m) => ({ default: m.ForgotPasswordPage }))
);
const DashboardOverview = lazy(() =>
  import("@/pages/dashboard/DashboardOverview").then((m) => ({ default: m.DashboardOverview }))
);
const TailorWizard = lazy(() => import("@/pages/workflow/TailorWizard").then((m) => ({ default: m.TailorWizard })));
const ResultsPage = lazy(() => import("@/pages/results/ResultsPage").then((m) => ({ default: m.ResultsPage })));
const HistoryPage = lazy(() => import("@/pages/dashboard/HistoryPage").then((m) => ({ default: m.HistoryPage })));
const SettingsPage = lazy(() => import("@/pages/dashboard/SettingsPage").then((m) => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size={28} />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DashboardOverview />} />
                    <Route path="tailor" element={<TailorWizard />} />
                    <Route path="results" element={<ResultsPage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
