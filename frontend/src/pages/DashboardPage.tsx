import { useCallback, useEffect, useState } from "react";
import {
  Sprout,
  CheckCircle2,
  Circle,
  Flame,
  RefreshCw,
  ArrowRight,
  ListTodo,
  CalendarDays,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { habitService, type Habit } from "@/services/habit.service";
import { taskService, type Task } from "@/services/task.service";

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

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingHabitId, setTogglingHabitId] = useState<string | null>(null);
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);

  const today = getToday();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const [habitResult, taskResult] = await Promise.allSettled([
      habitService.getAll(),
      taskService.getAll(),
    ]);

    const errors: string[] = [];

    if (habitResult.status === "fulfilled") {
      setHabits(habitResult.value);
    } else {
      errors.push(
        habitResult.reason instanceof Error
          ? `Habits: ${habitResult.reason.message}`
          : "Could not load your habits.",
      );
    }

    if (taskResult.status === "fulfilled") {
      setTasks(taskResult.value);
    } else {
      errors.push(
        taskResult.reason instanceof Error
          ? `Tasks: ${taskResult.reason.message}`
          : "Could not load your tasks.",
      );
    }

    setError(errors.join(" "));
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  const activeHabits = habits.filter((habit) => habit.startDate <= today);

  const completedHabits = activeHabits.filter((habit) =>
    habit.completedDates.includes(today),
  ).length;

  const remainingHabits = activeHabits.length - completedHabits;

  
  const todayTasks = tasks.filter((task) => task.date === today);
  const completedTasks = todayTasks.filter((task) => task.completed).length;
  const remainingTasks = todayTasks.length - completedTasks;

  const taskProgress =
    todayTasks.length === 0
      ? 0
      : Math.round((completedTasks / todayTasks.length) * 100);

  const handleToggleHabit = async (habit: Habit) => {
    if (togglingHabitId) return;

    setTogglingHabitId(habit._id);
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
      setTogglingHabitId(null);
    }
  };

  const handleToggleTask = async (task: Task) => {
    if (togglingTaskId) return;

    setTogglingTaskId(task._id);
    setError("");

    try {
      const updatedTask = await taskService.update(task._id, {
        completed: !task.completed,
      });

      setTasks((current) =>
        current.map((item) =>
          item._id === updatedTask._id ? updatedTask : item,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update this task.",
      );
    } finally {
      setTogglingTaskId(null);
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
          onClick={() => void fetchDashboard()}
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
            onClick={() => void fetchDashboard()}
            disabled={loading}
          >
            Try again
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-xl border border-border p-12 text-muted-foreground">
          <LoaderCircle className="size-5 animate-spin" />
          Loading your progress...
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                <p className="text-sm text-muted-foreground">
                  Habit completion
                </p>
                <CheckCircle2 className="size-5 text-primary" />
              </div>

              <p className="mt-4 text-3xl font-bold">
                {completedHabits}
                <span className="ml-1 text-base font-normal text-muted-foreground">
                  / {activeHabits.length}
                </span>
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {remainingHabits === 0 && activeHabits.length > 0
                  ? "All habits completed!"
                  : `${remainingHabits} habits left today`}
              </p>
            </article>

            <article className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Today's tasks</p>
                <ListTodo className="size-5 text-primary" />
              </div>

              <p className="mt-4 text-3xl font-bold">
                {completedTasks}
                <span className="ml-1 text-base font-normal text-muted-foreground">
                  / {todayTasks.length}
                </span>
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {remainingTasks === 0 && todayTasks.length > 0
                  ? "All tasks completed!"
                  : `${remainingTasks} tasks remaining`}
              </p>
            </article>

            <article className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Overall daily progress
                </p>
                <Flame className="size-5 text-primary" />
              </div>

              <p className="mt-4 text-3xl font-bold">
                {Math.round(
                  ((completedHabits + completedTasks) /
                    (activeHabits.length + todayTasks.length || 1)) *
                    100,
                )}
                %
              </p>

              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Overall daily progress"
                aria-valuenow={Math.round(
                  ((completedHabits + completedTasks) /
                    (activeHabits.length + todayTasks.length || 1)) *
                    100,
                )}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${
                      activeHabits.length + todayTasks.length === 0
                        ? 0
                        : ((completedHabits + completedTasks) /
                            (activeHabits.length + todayTasks.length)) *
                          100
                    }%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Habits + tasks completed today
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
              <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
                <Sprout className="mx-auto size-8 text-primary" />

                <h3 className="mt-4 font-semibold">
                  Start building your routine
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first habit and begin tracking your progress.
                </p>
                <Link
                  to="/habits"
                  className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  Create a habit
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeHabits.map((habit) => {
                  const completed = habit.completedDates.includes(today);
                  const isToggling = togglingHabitId === habit._id;

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
                        disabled={isToggling || togglingHabitId !== null}
                        onClick={() => void handleToggleHabit(habit)}
                      >
                        {isToggling ? (
                          <LoaderCircle className="mr-2 size-4 animate-spin" />
                        ) : completed ? (
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

          {/* Today's tasks */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Today's tasks</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Turn your plans into progress.
                </p>
              </div>

              <Link
                to="/tasks"
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                All tasks
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>

            {todayTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
                <ListTodo className="mx-auto size-8 text-primary" />

                <h3 className="mt-4 font-semibold">Nothing on your list yet</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Add a task for today and keep your momentum going.
                </p>

                <Link
                  to="/tasks"
                  className="mt-5 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  Add a task
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((task) => {
                  const isToggling = togglingTaskId === task._id;

                  return (
                    <article
                      key={task._id}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <button
                        type="button"
                        onClick={() => void handleToggleTask(task)}
                        disabled={togglingTaskId !== null}
                        aria-label={
                          task.completed
                            ? `Mark ${task.title} incomplete`
                            : `Complete ${task.title}`
                        }
                        className="shrink-0 rounded-full text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
                      >
                        {isToggling ? (
                          <LoaderCircle className="size-5 animate-spin" />
                        ) : task.completed ? (
                          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <CheckCircle2 className="size-4" />
                          </span>
                        ) : (
                          <Circle className="size-5" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`break-words text-sm font-medium ${
                            task.completed
                              ? "text-muted-foreground line-through"
                              : ""
                          }`}
                        >
                          {task.title}
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarDays className="size-3.5" />
                          {formatDate(task.date)}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                          task.completed
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {task.completed ? "Done" : "Pending"}
                      </span>
                    </article>
                  );
                })}
              </div>
            )}

            {todayTasks.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {taskProgress}% of today's tasks completed
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
