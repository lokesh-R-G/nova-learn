import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Wallet,
  CalendarDays,
  BookOpen,
  ClipboardCheck,
  Bell,
  Sparkles,
  Settings,
  ChevronsLeft,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRole, type Role } from "./role-context";

type Item = { to: string; label: string; icon: LucideIcon };

const NAV: Record<Role, { section: string; items: Item[] }[]> = {
  admin: [
    {
      section: "Admin Console",
      items: [
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/staff", label: "Academic Staff", icon: Users },
        { to: "/admin/students", label: "Student Directory", icon: GraduationCap },
        { to: "/admin/timetable", label: "Timetable", icon: CalendarDays },
        { to: "/accounts", label: "Financial Ledger", icon: Wallet },
      ],
    },
    { section: "AI Tools", items: [{ to: "/assistant", label: "Aether AI Assistant", icon: Sparkles }] },
  ],
  teacher: [
    {
      section: "Classroom",
      items: [
        { to: "/teacher", label: "Today", icon: LayoutDashboard },
        { to: "/teacher/assignments", label: "Assignments", icon: ClipboardCheck },
        { to: "/teacher/attendance", label: "Attendance", icon: Users },
        { to: "/teacher/insights", label: "Class Insights", icon: BookOpen },
      ],
    },
    { section: "AI Tools", items: [{ to: "/assistant", label: "Aether AI Assistant", icon: Sparkles }] },
  ],
  student: [
    {
      section: "Learning",
      items: [
        { to: "/student", label: "Dashboard", icon: LayoutDashboard },
        { to: "/student/subjects", label: "Subjects", icon: BookOpen },
        { to: "/student/assignments", label: "Assignments", icon: ClipboardCheck },
        { to: "/student/attendance", label: "Attendance", icon: CalendarDays },
      ],
    },
    { section: "AI Tools", items: [{ to: "/assistant", label: "Learning Assistant", icon: Sparkles }] },
  ],
  parent: [
    {
      section: "My Child",
      items: [
        { to: "/parent", label: "Overview", icon: LayoutDashboard },
        { to: "/parent/attendance", label: "Attendance", icon: CalendarDays },
        { to: "/parent/notifications", label: "Notifications", icon: Bell },
      ],
    },
  ],
  accounts: [
    {
      section: "Finance",
      items: [
        { to: "/accounts", label: "Fee Ledger", icon: Wallet },
        { to: "/accounts/transactions", label: "Transactions", icon: ClipboardCheck },
      ],
    },
  ],
};

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { role, current } = useRole();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const groups = NAV[role];

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 256 }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex"
    >
      <div className="flex items-center justify-between p-5">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-brand-foreground shadow-sm shadow-brand-600/30">
            <span className="text-sm font-bold">A</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight">AetherLMS</span>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary"
          >
            <ChevronsLeft className="size-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={onToggle}
          aria-label="Expand sidebar"
          className="mx-auto mb-2 rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary"
        >
          <ChevronsLeft className="size-4 rotate-180" />
        </button>
      )}

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4 scrollbar-none">
        {groups.map((g) => (
          <div key={g.section}>
            {!collapsed && (
              <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {g.section}
              </div>
            )}
            <div className="space-y-1">
              {g.items.map((it) => {
                const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
                const Icon = it.icon;
                return (
                  <Link
                    key={it.to}
                    {...({ to: it.to } as any)}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", active && "text-brand-600")} />
                    {!collapsed && <span className="truncate">{it.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className={cn("flex items-center gap-3 rounded-lg p-2", collapsed && "justify-center")}>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-sm font-semibold text-brand-foreground">
            {current.person
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{current.person}</p>
              <p className="truncate text-xs text-muted-foreground">{current.subtitle}</p>
            </div>
          )}
          {!collapsed && (
            <Settings className="size-4 text-muted-foreground hover:text-foreground" />
          )}
        </div>
      </div>
    </motion.aside>
  );
}
