import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  ListChecks,
  UserRound,
  Settings,
} from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: Sprout },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-2 bottom-3 z-50 grid grid-cols-5 rounded-2xl border border-border bg-card/95 p-1.5 shadow-lg backdrop-blur md:hidden">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          aria-label={label}
          className={({ isActive }) =>
            [
              "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 text-[11px] transition-colors sm:text-xs",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")
          }
        >
          <Icon size={19} />
          <span className="truncate">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}