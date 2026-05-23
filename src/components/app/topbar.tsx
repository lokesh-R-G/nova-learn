import { Search, Bell, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useRole, ROLES, type Role } from "./role-context";
import { useAuth } from "@/hooks/use-auth";

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { role, setRole, current } = useRole();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const { auth, logout } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          aria-label="Toggle menu"
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary md:hidden"
        >
          <Menu className="size-5" />
        </button>
        <div className="relative hidden w-72 md:block lg:w-96">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students, records, reports…"
            className="w-full rounded-full border-none bg-secondary py-2 pl-10 pr-4 text-sm outline-none ring-0 focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
                {auth && (
                  <button
                    onClick={logout}
                    className="hidden rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary md:inline-flex"
                  >
                    Sign out
                  </button>
                )}
        <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1 md:flex">
          <span className="size-2 rounded-full bg-success" />
          <span className="text-xs font-medium text-muted-foreground">Operational</span>
        </div>

        <select
          value={role}
          onChange={(e) => {
            const r = e.target.value as Role;
            setRole(r);
            navigate({ to: `/${r}` as any });
          }}
          aria-label="Switch role"
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>
              View as {r.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle theme"
          className="rounded-full p-2 text-muted-foreground hover:bg-secondary"
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        <button
          aria-label="Notifications"
          className="relative rounded-full bg-secondary p-2 text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-background bg-brand-600" />
        </button>

        <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-xs font-bold text-brand-foreground">
          {current.person
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")}
        </div>
      </div>
    </header>
  );
}
