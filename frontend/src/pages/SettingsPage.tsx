import { Link } from "react-router-dom";
import { Moon, Palette, Sun, UserRound, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  const selectTheme = (selectedTheme: "light" | "dark") => {
    if (theme !== selectedTheme) {
      toggleTheme();
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Personalise your HabHeat experience.
        </p>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Palette className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Appearance</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose the theme you prefer for your workspace.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => selectTheme("light")}
            aria-pressed={theme === "light"}
            className={[
              "flex items-center justify-between rounded-xl border p-4 text-left transition-colors",
              theme === "light"
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted/50",
            ].join(" ")}
          >
            <span className="flex items-center gap-3">
              <Sun className="size-5 text-primary" />
              <span>
                <span className="block font-medium">Light mode</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  A bright, clean workspace
                </span>
              </span>
            </span>

            {theme === "light" && <Check className="size-5 text-primary" />}
          </button>

          <button
            type="button"
            onClick={() => selectTheme("dark")}
            aria-pressed={theme === "dark"}
            className={[
              "flex items-center justify-between rounded-xl border p-4 text-left transition-colors",
              theme === "dark"
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted/50",
            ].join(" ")}
          >
            <span className="flex items-center gap-3">
              <Moon className="size-5 text-primary" />
              <span>
                <span className="block font-medium">Dark mode</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  A darker, low-light workspace
                </span>
              </span>
            </span>

            {theme === "dark" && <Check className="size-5 text-primary" />}
          </button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Your theme preference is saved automatically.
        </p>
      </div>

      {/* Account */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold">Account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your personal information and account details.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Profile information</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your name and email address.
            </p>
          </div>

          <Link
            to="/profile"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            Manage profile
          </Link>
        </div>
      </div>

      {/* About */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">About HabHeat</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          HabHeat helps you build consistent habits, track your progress, and
          organise your daily tasks. Small steps. Daily progress.
        </p>
      </div>
    </section>
  );
}
