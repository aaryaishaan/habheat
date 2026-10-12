import { useCallback, useEffect, useState } from "react";
import {
  Sprout,
  CheckCircle2,
  Circle,
  Flame,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { habitService, type Habit } from "@/services/habit.service";

function getToday(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const today = getToday();

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await habitService.getAll();
      setHabits(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load your dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHabits();
  }, [fetchHabits]);

  const activeHabits = habits.filter((habit) => habit.startDate <= today);

  const completedCount = activeHabits.filter((habit) =>
    habit.completedDates.includes(today),
  ).length;

  const remainingCount = activeHabits.length - completedCount;

  const progress =
    activeHabits.length === 0
      ? 0
      : Math.round((completedCount / activeHabits.length) * 100);

  const handleToggle = async (habit: Habit) => {
    setTogglingId(habit._id);
    setError("");

    try {
      const updatedHabit = await habitService.toggleCompletion(
        habit._id,
        today,
      );

      setHabits((current) =>
        current.map((item) => (item._id === habit._id ? updatedHabit : item)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update this habit.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <section className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {getGreeting()}!
          </h1>

          <p className="mt-2 text-muted-foreground">
            Small steps today. Big changes over time.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void fetchHabits()}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 p-4 text-sm text-destructive"
        >
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchHabits()}
          >
            Try again
          </Button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-border p-12 text-center text-muted-foreground">
          Loading your progress...
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Active habits</p>
                <Sprout className="size-5 text-primary" />
              </div>

              <p className="mt-4 text-3xl font-bold">{activeHabits.length}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Habits started by today
              </p>
            </article>

            <article className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Completed today</p>
                <CheckCircle2 className="size-5 text-primary" />
              </div>

              <p className="mt-4 text-3xl font-bold">
                {completedCount}
                <span className="ml-1 text-base font-normal text-muted-foreground">
                  / {activeHabits.length}
                </span>
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {remainingCount === 0 && activeHabits.length > 0
                  ? "Everything done. Great work!"
                  : `${remainingCount} habits left for today`}
              </p>
            </article>

            <article className="rounded-xl border border-border bg-card p-5 sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Today's progress
                </p>
                <Flame className="size-5 text-primary" />
              </div>

              <p className="mt-4 text-3xl font-bold">{progress}%</p>

              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Today's habit completion"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {activeHabits.length === 0
                  ? "Create a habit to get started"
                  : "Keep your momentum going"}
              </p>
            </article>
          </div>

          {/* Today's habits */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Today's habits</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  One small win at a time.
                </p>
              </div>

              <Link
                to="/habits"
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Manage habits
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>

            {activeHabits.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
                <Sprout className="mx-auto size-8 text-primary" />

                <h3 className="mt-4 font-semibold">
                  Start building your routine
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first habit and begin tracking your progress.
                </p>

                <Button
                  className="mt-5"
                  onClick={() => {
                    window.location.href = "/habits";
                  }}
                >
                  Create a habit
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeHabits.map((habit) => {
                  const completed = habit.completedDates.includes(today);
                  const isToggling = togglingId === habit._id;

                  return (
                    <article
                      key={habit._id}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <span
                        className="size-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor: habit.color || "#22c55e",
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate font-medium ${
                            completed
                              ? "text-muted-foreground line-through"
                              : ""
                          }`}
                        >
                          {habit.name}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {habit.completedDates.length} total{" "}
                          {habit.completedDates.length === 1
                            ? "completion"
                            : "completions"}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant={completed ? "outline" : "default"}
                        disabled={isToggling}
                        onClick={() => void handleToggle(habit)}
                      >
                        {completed ? (
                          <CheckCircle2 className="mr-2 size-4" />
                        ) : (
                          <Circle className="mr-2 size-4" />
                        )}

                        {isToggling
                          ? "Updating..."
                          : completed
                            ? "Completed"
                            : "Mark done"}
                      </Button>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
