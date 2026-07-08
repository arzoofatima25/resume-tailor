import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { AuthShell } from "./AuthShell";
import { Button } from "@/components/ui/Button";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthConfigNotice } from "@/components/auth/AuthConfigNotice";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { signInWithEmail, signInWithGoogle, isFirebaseConfigured } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const redirectTo = (location.state as { from?: string } | null)?.from || "/dashboard";

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    try {
      await signInWithEmail(values.email, values.password);
      showToast("Welcome back!", "success");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const onGoogleSignIn = async () => {
    setFormError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      showToast("Welcome back!", "success");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to keep tailoring your applications."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-primary-600 dark:text-primary-400">
            Sign up
          </Link>
        </>
      }
    >
      {!isFirebaseConfigured && <AuthConfigNotice />}

      <GoogleSignInButton onClick={onGoogleSignIn} isLoading={googleLoading} />

      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        or continue with email
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      {formError && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-danger-500/30 bg-danger-500/10 p-3 text-sm text-danger-600 dark:text-danger-400">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <div className="relative mt-1.5">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 py-2.5 pl-9 pr-3 text-sm focus-visible:outline-primary-500"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-danger-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary-600 dark:text-primary-400">
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 py-2.5 pl-9 pr-3 text-sm focus-visible:outline-primary-500"
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-danger-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}
