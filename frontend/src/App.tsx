import { Button } from "@/components/ui/button";

function App() {
  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <header>
          <p className="text-sm text-muted-foreground">
            HabHeat Design System
          </p>

          <h1 className="mt-2 text-4xl font-semibold">
            Build consistency.
          </h1>

          <p className="mt-3 max-w-xl text-muted-foreground">
            A calm place to track your habits and tasks.
          </p>
        </header>

        {/* Card */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">
            Primary action
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            This component uses the HabHeat design tokens.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button>
              Add Habit
            </Button>

            <Button variant="outline">
              View Habits
            </Button>

            <Button variant="secondary">
              Secondary
            </Button>

            <Button variant="ghost">
              Ghost
            </Button>
          </div>
        </section>

      </div>
    </main>
  );
}

export default App;