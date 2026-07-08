import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { AuthShell } from "./AuthShell";
import { Button } from "@/components/ui/Button";
import { AuthConfigNotice } from "@/components/auth/AuthConfigNotice";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({ email: z.string().email("Enter a valid email address.") });
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { resetPassword, isFirebaseConfigured } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    try {
      await resetPassword(values.email);
      setSent(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll send you a link to get back into your account."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary-600 dark:text-primary-400">
            Log in
          </Link>
        </>
      }
    >
      {!isFirebaseConfigured && <AuthConfigNotice />}

      {sent ? (
        <div className="flex flex-col items-center gap-3 rounded-xl2 bg-success-500/10 p-6 text-center">
          <CheckCircle2 className="text-success-500" size={32} />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            If an account exists for that email, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {formError && (
            <div className="flex items-start gap-2 rounded-xl border border-danger-500/30 bg-danger-500/10 p-3 text-sm text-danger-600 dark:text-danger-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {formError}
            </div>
          )}
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
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
