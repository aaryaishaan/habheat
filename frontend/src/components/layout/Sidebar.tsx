
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  ListChecks,
  UserRound,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: Sprout },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-border bg-card p-5 md:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sprout size={23} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">
            HabHeat
          </h1>
          <p className="text-xs text-muted-foreground">
            Build consistency.
          </p>
        </div>
      </div>

      <p className="mb-3 px-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Workspace
      </p>

      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-xl border border-border bg-background p-4">
        <p className="font-medium">Small steps.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily progress.
        </p>
      </div>
    </aside>
  );
}
