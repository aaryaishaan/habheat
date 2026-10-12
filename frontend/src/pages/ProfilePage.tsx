
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, loading, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const hasChanges =
    name.trim() !== (user?.name ?? "") ||
    email.trim() !== (user?.email ?? "");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setError("Name and email are required.");
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile({
        name: trimmedName,
        email: trimmedEmail,
      });
      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setError("");
    setSuccess("");
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setLogoutError(
        err instanceof Error
          ? err.message
          : "Unable to log out. Please try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoaderCircle className="size-7 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground">
          Loading your profile...
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl space-y-3">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">
          Unable to load your account information. Please log in again.
        </p>
        <Button type="button" onClick={() => navigate("/login")}>
          Go to login
        </Button>
      </section>
    );
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="mx-auto w-full max-w-4xl space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account and personal information.
        </p>
      </div>

      {/* Account summary */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
          {initials || <UserRound className="size-7" />}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold">{user.name}</h2>
          <p className="mt-1 break-all text-sm text-muted-foreground">
            {user.email}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Account information
          </p>
        </div>
      </div>

      {/* Edit profile */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-6"
      >
        <div>
          <h2 className="text-lg font-semibold">Personal information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your account details up to date.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profile-name"
            className="text-sm font-medium"
          >
            Full name
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="profile-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profile-email"
            className="text-sm font-medium"
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="profile-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={saving || !hasChanges}
            className="gap-2"
          >
            <RotateCcw className="size-4" />
            Discard changes
          </Button>

          <Button
            type="submit"
            disabled={saving || !hasChanges}
            className="gap-2"
          >
            {saving ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>

      {/* Account actions */}
      <div className="rounded-2xl border border-destructive/20 bg-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Account actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Finished for today? Sign out of your HabHeat account.
        </p>

        {logoutError && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{logoutError}</span>
          </div>
        )}

        <Button
          type="button"
          variant="destructive"
          disabled={loggingOut}
          onClick={handleLogout}
          className="mt-5 w-full gap-2 sm:w-auto"
        >
          {loggingOut ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          {loggingOut ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </section>
  );
}
