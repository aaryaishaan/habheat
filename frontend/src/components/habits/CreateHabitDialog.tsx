
import { useState } from "react";
import { Plus, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  habitService,
  type Habit,
} from "@/services/habit.service";

interface CreateHabitDialogProps {
  onCreated: (habit: Habit) => void;
}

const habitColors = [
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
];

export default function CreateHabitDialog({
  onCreated,
}: CreateHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(habitColors[0].value);
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setColor(habitColors[0].value);
    setStartDate(new Date().toLocaleDateString("en-CA"));
    setError("");
  };

  const handleSubmit = async (
    event: Parameters<
      NonNullable<React.ComponentProps<"form">["onSubmit"]>
    >[0],
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Please enter a habit name.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const habit = await habitService.create({
        name: name.trim(),
        color,
        startDate,
      });

      onCreated(habit);
      resetForm();
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create the habit.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 size-4" />
        New habit
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-habit-title"
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sprout className="size-6" />
              </div>

              <div>
                <h2
                  id="create-habit-title"
                  className="text-lg font-semibold"
                >
                  Create a habit
                </h2>
                <p className="text-sm text-muted-foreground">
                  Start building a better routine.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="habit-name"
                  className="text-sm font-medium"
                >
                  Habit name
                </label>

                <input
                  id="habit-name"
                  autoFocus
                  required
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Read for 20 minutes"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Choose a colour
                </label>

                <div className="flex gap-3">
                  {habitColors.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      title={item.name}
                      aria-label={item.name}
                      aria-pressed={color === item.value}
                      onClick={() => setColor(item.value)}
                      className={`size-8 rounded-full transition ${
                        color === item.value
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: item.value }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="habit-start-date"
                  className="text-sm font-medium"
                >
                  Start date
                </label>

                <input
                  id="habit-start-date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  max={new Date().toLocaleDateString("en-CA")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => {
                    setOpen(false);
                    setError("");
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={saving}>
                  {saving ? "Creating..." : "Create habit"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
