import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { HISTORY_STORAGE_KEY } from "@/constants";

export function SettingsPage() {
  const { user, updateDisplayName } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);

  const isGoogleAccount = user?.providerData.some((p) => p.providerId === "google.com");
  const nameChanged = name.trim() !== (user?.displayName ?? "").trim();

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("Name can't be empty.", "error");
      return;
    }
    setSaving(true);
    try {
      await updateDisplayName(name);
      showToast("Profile updated.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't update your profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <div className="flex items-center gap-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              referrerPolicy="no-referrer"
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand text-lg font-semibold text-white">
              {(name || user?.email || "?")[0]?.toUpperCase()}
            </span>
          )}
          <div>
            <h2 className="font-display text-lg font-semibold">Profile</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isGoogleAccount ? "Signed in with Google" : "Signed in with email"}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Full name
            </label>
            <input
              id="fullName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2.5 text-sm focus-visible:outline-primary-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="email"
              disabled
              value={user?.email ?? ""}
              className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-3 py-2.5 text-sm text-slate-500"
            />
            <p className="mt-1 text-xs text-slate-400">
              {isGoogleAccount
                ? "Managed by your Google account."
                : "Contact support to change the email on your account."}
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} isLoading={saving} disabled={!nameChanged}>
              Save changes
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Appearance</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Switch between light and dark mode.</p>
          </div>
          <ThemeSwitch />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold text-danger-500">Danger zone</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Clear all locally stored analysis history.</p>
        <Button
          variant="danger"
          size="sm"
          className="mt-4"
          onClick={() => {
            window.localStorage.removeItem(HISTORY_STORAGE_KEY);
            window.location.reload();
          }}
        >
          Clear history
        </Button>
      </Card>
    </div>
  );
}
