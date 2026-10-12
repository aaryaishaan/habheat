
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
