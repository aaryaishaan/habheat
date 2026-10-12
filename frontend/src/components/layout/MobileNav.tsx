
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  ListChecks,
  UserRound,
} from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: Sprout },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-2xl border border-border bg-card/95 p-2 shadow-lg backdrop-blur md:hidden">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
