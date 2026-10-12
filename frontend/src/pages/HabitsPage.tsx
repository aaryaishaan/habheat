import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  Sprout,
  Pencil,
  Trash2,
  Check,
  X,
  CalendarCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import CreateHabitDialog from "@/components/habits/CreateHabitDialog";
import HabitHeatmap from "@/components/habits/HabitHeatmap";
import { habitService, type Habit } from "@/services/habit.service";

const habitColors = [
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#f97316",
  "#ec4899",
];

function getToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState(habitColors[0]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await habitService.getAll();
      setHabits(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load your habits.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHabits();
  }, [fetchHabits]);

  const startEditing = (habit: Habit) => {
    setEditingId(habit._id);
    setEditName(habit.name);
    setEditColor(habit.color || habitColors[0]);
    setActionError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setActionError("");
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) {
      setActionError("Habit name cannot be empty.");
      return;
    }

    setSavingId(id);
    setActionError("");

    try {
      const updatedHabit = await habitService.update(id, {
        name: editName.trim(),
        color: editColor,
      });

      setHabits((current) =>
        current.map((habit) =>
          habit._id === id ? updatedHabit : habit,
        ),
      );

      cancelEditing();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to update habit.",
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (habit: Habit) => {
    const confirmed = window.confirm(
      `Delete "${habit.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(habit._id);
    setActionError("");

    try {
      await habitService.delete(habit._id);

      setHabits((current) =>
        current.filter((item) => item._id !== habit._id),
      );

      if (editingId === habit._id) {
        cancelEditing();
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete habit.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (habit: Habit) => {
    const today = getToday();

    setTogglingId(habit._id);
    setActionError("");

    try {
      const updatedHabit = await habitService.toggleCompletion(
        habit._id,
        today,
      );

      setHabits((current) =>
        current.map((item) =>
          item._id === habit._id ? updatedHabit : item,
        ),
      );
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to update today's completion.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <section className="space-y-6">
      {/* Page heading and actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Habits</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build consistency, one day at a time.
          </p>
        </div>

        <div className="flex gap-2">
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

          <CreateHabitDialog
            onCreated={(habit) =>
              setHabits((current) => [habit, ...current])
            }
          />
        </div>
      </div>

      {/* Errors from edit, delete, or completion actions */}
      {actionError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg border border-destructive/30 p-3 text-sm text-destructive"
        >
          <p>{actionError}</p>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setActionError("")}
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Loading, error, empty, and populated states */}
      {loading ? (
        <div className="rounded-xl border border-border p-10 text-center text-muted-foreground">
          Loading your habits...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 p-6">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => void fetchHabits()}
          >
            Try again
          </Button>
        </div>
      ) : habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sprout className="size-7" />
          </div>

          <h2 className="text-lg font-semibold">No habits yet</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Your habits will appear here once you create your first one.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {habits.map((habit) => {
            const completedToday =
              habit.completedDates.includes(getToday());
            const isEditing = editingId === habit._id;

            return (
              <article
                key={habit._id}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                {isEditing ? (
                  /* Edit form */
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor={`edit-name-${habit._id}`}
                        className="text-sm font-medium"
                      >
                        Habit name
                      </label>

                      <input
                        id={`edit-name-${habit._id}`}
                        type="text"
                        value={editName}
                        maxLength={100}
                        required
                        autoFocus
                        onChange={(event) =>
                          setEditName(event.target.value)
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Colour</p>

                      <div className="flex gap-3">
                        {habitColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            aria-label={`Choose ${color}`}
                            aria-pressed={editColor === color}
                            onClick={() => setEditColor(color)}
                            className={`size-7 rounded-full ${
                              editColor === color
                                ? "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                                : ""
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => void handleUpdate(habit._id)}
                        disabled={savingId === habit._id}
                      >
                        <Check className="mr-1 size-4" />
                        {savingId === habit._id ? "Saving..." : "Save"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                        disabled={savingId === habit._id}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Habit card */
                  <>
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 size-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor: habit.color || "#22c55e",
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate font-semibold">
                          {habit.name}
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Started {habit.startDate}
                        </p>

                        <p className="mt-3 text-sm text-muted-foreground">
                          {habit.completedDates.length}{" "}
                          {habit.completedDates.length === 1
                            ? "completion"
                            : "completions"}
                        </p>
                      </div>
                    </div>

                    {/* Per-habit consistency heatmap */}
                    <HabitHeatmap
                      completedDates={habit.completedDates}
                      color={habit.color || "#22c55e"}
                    />

                    {/* Daily completion */}
                    <Button
                      className="mt-5 w-full"
                      variant={completedToday ? "outline" : "default"}
                      onClick={() => void handleToggle(habit)}
                      disabled={
                        togglingId === habit._id ||
                        deletingId === habit._id
                      }
                    >
                      {completedToday ? (
                        <X className="mr-2 size-4" />
                      ) : (
                        <CalendarCheck className="mr-2 size-4" />
                      )}

                      {togglingId === habit._id
                        ? "Updating..."
                        : completedToday
                          ? "Undo today's completion"
                          : "Mark complete today"}
                    </Button>

                    {/* Edit and delete actions */}
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => startEditing(habit)}
                        disabled={deletingId === habit._id}
                      >
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1 text-destructive hover:text-destructive"
                        onClick={() => void handleDelete(habit)}
                        disabled={
                          deletingId === habit._id ||
                          togglingId === habit._id
                        }
                      >
                        <Trash2 className="mr-2 size-4" />
                        {deletingId === habit._id
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
