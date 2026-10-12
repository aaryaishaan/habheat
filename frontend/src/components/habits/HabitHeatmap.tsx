import { useMemo } from "react";

interface HabitHeatmapProps {
  completedDates: string[];
  color?: string;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function HabitHeatmap({
  completedDates,
  color = "#22c55e",
}: HabitHeatmapProps) {
  const { weeks, totalCompletions, monthLabels } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start on Sunday, 11 weeks before the current week.
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() - 11 * 7);

    const completed = new Set(completedDates);
    const allWeeks: { date: Date; key: string; done: boolean }[][] = [];
    const labels: { text: string; column: number }[] = [];

    let total = 0;
    let previousMonth = -1;

    for (let week = 0; week < 12; week++) {
      const days: { date: Date; key: string; done: boolean }[] = [];

      for (let day = 0; day < 7; day++) {
        const date = new Date(start);
        date.setDate(start.getDate() + week * 7 + day);

        if (date > today) break;

        const key = formatDate(date);
        const done = completed.has(key);

        if (done) total++;

        if (date.getMonth() !== previousMonth) {
          labels.push({
            text: date.toLocaleDateString("en", { month: "short" }),
            column: week,
          });
          previousMonth = date.getMonth();
        }

        days.push({ date, key, done });
      }

      allWeeks.push(days);
    }

    return {
      weeks: allWeeks,
      totalCompletions: total,
      monthLabels: labels,
    };
  }, [completedDates]);

  return (
    <div className="mt-5 border-t border-border pt-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Consistency</p>
        <p className="text-xs text-muted-foreground">
          {totalCompletions} completions · 12 weeks
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[270px]">
          <div
            className="mb-2 grid gap-[3px] text-[10px] text-muted-foreground"
            style={{
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            }}
          >
            {Array.from({ length: 12 }, (_, column) => {
              const label = monthLabels.find(
                (item) => item.column === column,
              );

              return (
                <span key={column} className="overflow-visible">
                  {label?.text ?? ""}
                </span>
              );
            })}
          </div>

          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="flex flex-1 flex-col gap-[3px]"
              >
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const day = week[dayIndex];

                  if (!day) {
                    return (
                      <div
                        key={dayIndex}
                        className="aspect-square w-full"
                      />
                    );
                  }

                  return (
                    <div
                      key={day.key}
                      title={`${day.key}: ${
                        day.done ? "Completed" : "Not completed"
                      }`}
                      aria-label={`${day.key}: ${
                        day.done ? "Completed" : "Not completed"
                      }`}
                      className="aspect-square w-full rounded-[3px] border border-border/40"
                      style={{
                        backgroundColor: day.done
                          ? color
                          : "var(--muted)",
                        opacity: day.done ? 1 : 0.55,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        <span className="size-3 rounded-[3px] border border-border/40 bg-muted/60" />
        <span
          className="size-3 rounded-[3px]"
          style={{ backgroundColor: color }}
        />
        <span>More</span>
      </div>
    </div>
  );
}