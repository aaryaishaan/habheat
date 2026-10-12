import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  CheckSquare,
  UserRound,
  LogOut,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Habits",
    href: "/habits",
    icon: Sprout,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: UserRound,
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Unable to log out. Please try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-border bg-card p-5 md:flex">
      {/* Branding */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sprout className="size-6" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">HabHeat</h1>
          <p className="text-xs text-muted-foreground">
            Build better habits
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")
              }
            >
              <Icon className="size-5" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-8">
        <div className="mb-4 rounded-xl border border-border bg-background p-4">
          <p className="text-sm font-medium">Small steps.</p>
          <p className="text-sm text-muted-foreground">
            Daily progress.
          </p>
        </div>

        {/* Current user */}
        <div className="mb-3 truncate px-3 text-sm text-muted-foreground">
          {user?.name}
        </div>

        {/* Logout */}
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}

          {loggingOut ? "Logging out..." : "Log out"}
        </Button>

        {logoutError && (
          <p role="alert" className="mt-2 px-3 text-xs text-destructive">
            {logoutError}
          </p>
        )}
      </div>
    </aside>
  );
}
