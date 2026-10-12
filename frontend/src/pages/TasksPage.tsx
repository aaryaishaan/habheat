import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Circle,
  ListTodo,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { taskService, type Task } from "@/services/task.service";

function getToday(): string {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDateLabel(date: string): string {
  const today = getToday();

  if (date === today) return "Today";
  if (date < today) return "Past";
  return "Upcoming";
}

type TaskGroup = {
  title: string;
  tasks: Task[];
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getToday());

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await taskService.getAll();
      setTasks(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tasks.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || !date || saving) return;

    setSaving(true);
    setError("");

    try {
      const createdTask = await taskService.create({
        title: trimmedTitle,
        date,
      });

      setTasks((current) => [...current, createdTask]);
      setTitle("");
      setDate(getToday());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create task.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(task: Task) {
    setError("");

    const previousTasks = tasks;

    setTasks((current) =>
      current.map((item) =>
        item._id === task._id
          ? { ...item, completed: !item.completed }
          : item,
      ),
    );

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
      setTasks(previousTasks);
      setError(
        err instanceof Error ? err.message : "Failed to update task.",
      );
    }
  }

  function startEditing(task: Task) {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDate(task.date);
    setError("");
  }

  async function handleSaveEdit(id: string) {
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle || !editDate || saving) return;

    setSaving(true);
    setError("");

    try {
      const updatedTask = await taskService.update(id, {
        title: trimmedTitle,
        date: editDate,
      });

      setTasks((current) =>
        current.map((task) =>
          task._id === id ? updatedTask : task,
        ),
      );

      setEditingId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to edit task.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!taskToDelete || deleting) return;

    setDeleting(true);
    setError("");

    try {
      await taskService.delete(taskToDelete._id);

      setTasks((current) =>
        current.filter((item) => item._id !== taskToDelete._id),
      );

      if (editingId === taskToDelete._id) {
        setEditingId(null);
      }

      setTaskToDelete(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete task.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;
  const remainingCount = tasks.length - completedCount;

  const groupDefinitions = [
    {
      title: "Today",
      matches: (task: Task) => getDateLabel(task.date) === "Today",
    },
    {
      title: "Upcoming",
      matches: (task: Task) => getDateLabel(task.date) === "Upcoming",
    },
    {
      title: "Past",
      matches: (task: Task) => getDateLabel(task.date) === "Past",
    },
  ];

  const groups: TaskGroup[] = groupDefinitions
    .map((group) => ({
      title: group.title,
      tasks: tasks
        .filter(group.matches)
        .sort((a, b) => a.date.localeCompare(b.date)),
    }))
    .filter((group) => group.tasks.length > 0);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <ListTodo className="size-4" />
            <span>Your productivity</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Small steps, consistent progress.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void loadTasks()}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total tasks</p>
          <p className="mt-2 text-3xl font-semibold">{tasks.length}</p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className="mt-2 text-3xl font-semibold">{remainingCount}</p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="mt-2 text-3xl font-semibold">{completedCount}</p>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Add a task</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Give your next task a name and a date.
        </p>

        <form
          onSubmit={handleCreate}
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-medium"
            >
              Task title
            </label>

            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Complete DSA practice"
              maxLength={200}
              required
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="sm:w-44">
            <label
              htmlFor="task-date"
              className="mb-2 block text-sm font-medium"
            >
              Due date
            </label>

            <input
              id="task-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Button
            type="submit"
            disabled={saving || !title.trim() || !date}
          >
            {saving ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <Plus className="mr-2 size-4" />
            )}
            Add task
          </Button>
        </form>
      </section>

      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
          <LoaderCircle className="size-5 animate-spin" />
          Loading your tasks...
        </div>
      ) : tasks.length === 0 ? (
        <section className="flex flex-col items-center rounded-xl border border-dashed px-6 py-14 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
            <ListTodo className="size-7 text-muted-foreground" />
          </div>

          <h2 className="text-lg font-semibold">A fresh start</h2>

          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            No tasks yet. Add your first task above and start making progress.
          </p>
        </section>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.title} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{group.title}</h2>

                <span className="text-sm text-muted-foreground">
                  {group.tasks.length}{" "}
                  {group.tasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border bg-card">
                {group.tasks.map((task, index) => (
                  <div
                    key={task._id}
                    className={`p-4 ${
                      index !== group.tasks.length - 1 ? "border-b" : ""
                    }`}
                  >
                    {editingId === task._id ? (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="min-w-0 flex-1">
                          <label
                            htmlFor={`edit-title-${task._id}`}
                            className="mb-1 block text-xs text-muted-foreground"
                          >
                            Task title
                          </label>

                          <input
                            id={`edit-title-${task._id}`}
                            value={editTitle}
                            onChange={(event) =>
                              setEditTitle(event.target.value)
                            }
                            maxLength={200}
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </div>

                        <div className="sm:w-44">
                          <label
                            htmlFor={`edit-date-${task._id}`}
                            className="mb-1 block text-xs text-muted-foreground"
                          >
                            Due date
                          </label>

                          <input
                            id={`edit-date-${task._id}`}
                            type="date"
                            value={editDate}
                            onChange={(event) =>
                              setEditDate(event.target.value)
                            }
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            onClick={() => void handleSaveEdit(task._id)}
                            disabled={
                              saving || !editTitle.trim() || !editDate
                            }
                            aria-label="Save task"
                          >
                            <Check className="size-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                            disabled={saving}
                            aria-label="Cancel editing"
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => void handleToggle(task)}
                          className="mt-0.5 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-primary"
                          aria-label={
                            task.completed
                              ? `Mark ${task.title} incomplete`
                              : `Complete ${task.title}`
                          }
                        >
                          {task.completed ? (
                            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Check className="size-3.5" />
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

                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEditing(task)}
                            aria-label={`Edit ${task.title}`}
                          >
                            <Pencil className="size-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setTaskToDelete(task)}
                            aria-label={`Delete ${task.title}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Delete task?"
        description={
          taskToDelete
            ? `This will permanently remove "${taskToDelete.title}". This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete task"
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => {
          if (!deleting) setTaskToDelete(null);
        }}
      />
    </div>
  );
}