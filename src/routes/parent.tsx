import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle, CheckCircle2, Info, MessageSquare } from "lucide-react";
import { Card, PageHeader, SecondaryButton, SectionTitle, Badge } from "@/components/app/ui-bits";
import { Skeleton } from "@/components/ui/skeleton";
import { RequireRole } from "@/components/app/require-role";
import { useAuth } from "@/hooks/use-auth";
import { resolveParentStudentId } from "@/lib/defaults";
import { useAttendance, useFees, useMarks } from "@/hooks/api-hooks";

export const Route = createFileRoute("/parent")({
  head: () => ({
    meta: [
      { title: "Parent Dashboard — AetherLMS" },
      { name: "description", content: "Your child's performance, attendance and notifications." },
    ],
  }),
  component: ParentDashboard,
});

function ParentDashboard() {
  const { auth } = useAuth();
  const studentId = resolveParentStudentId(auth);
  const { data: marks, isLoading: marksLoading, error: marksError } = useMarks(studentId);
  const { data: attendance, isLoading: attendanceLoading, error: attendanceError } = useAttendance(studentId);
  const { data: fees, isLoading: feesLoading, error: feesError } = useFees(studentId);

  const subjectMarks = useMemo(() => {
    const map = new Map<string, { total: number; max: number }>();
    (marks ?? []).forEach((m) => {
      const existing = map.get(m.subject) ?? { total: 0, max: 0 };
      map.set(m.subject, { total: existing.total + m.marks, max: existing.max + m.max_marks });
    });
    return Array.from(map.entries()).map(([subject, totals]) => ({
      s: subject,
      m: totals.max ? Math.round((totals.total / totals.max) * 100) : 0,
    }));
  }, [marks]);

  const attendanceStats = useMemo(() => {
    const total = attendance?.length ?? 0;
    const present = attendance?.filter((r) => r.status === "present").length ?? 0;
    const percent = total ? Math.round((present / total) * 100) : 0;
    return { total, present, percent };
  }, [attendance]);

  const notifications = useMemo(() => {
    const items = [] as Array<{
      icon: typeof AlertTriangle;
      tone: "danger" | "success" | "brand" | "warning";
      t: string;
      d: string;
    }>;

    const absent = attendance?.find((r) => r.status === "absent");
    if (absent) {
      items.push({
        icon: AlertTriangle,
        tone: "danger",
        t: `Absent on ${new Date(absent.date).toLocaleDateString()}`,
        d: "Attendance record flagged as absent",
      });
    }

    if (marks && marks.length) {
      const top = [...marks].sort((a, b) => b.marks - a.marks)[0];
      items.push({
        icon: CheckCircle2,
        tone: "success",
        t: `${top.subject} result published`,
        d: `${top.exam} — ${top.marks}/${top.max_marks}`,
      });
    }

    if (fees && fees.balance > 0) {
      items.push({
        icon: AlertTriangle,
        tone: "warning",
        t: "Tuition balance due",
        d: `Outstanding balance $${fees.balance.toLocaleString()}`,
      });
    }

    if (!items.length) {
      items.push({
        icon: Info,
        tone: "brand",
        t: "All caught up",
        d: "No new alerts for this student.",
      });
    }

    return items;
  }, [attendance, marks, fees]);

  const hasError = marksError || attendanceError || feesError;

  return (
    <RequireRole roles={["parent", "admin"]}>
      <PageHeader
        title="Aria's overview"
        subtitle="Grade 11-A • Roll 11A-01"
        actions={<SecondaryButton><MessageSquare className="size-4" /> Message Teacher</SecondaryButton>}
      />

      {hasError && (
        <Card className="mb-6 border-danger/40 bg-danger/5">
          <p className="text-sm text-danger">Unable to load parent dashboard data.</p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {[
          { l: "Overall Grade", v: subjectMarks[0]?.m ? `${subjectMarks[0].m}%` : "—", d: "Latest assessment" },
          { l: "Attendance", v: `${attendanceStats.percent}%`, d: `${attendanceStats.present}/${attendanceStats.total} classes` },
          { l: "Assignments", v: "24/26", d: "92% on time" },
          { l: "Balance", v: fees ? `$${fees.balance.toLocaleString()}` : "—", d: "Outstanding" },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card hoverable>
              <p className="text-sm font-medium text-muted-foreground">{s.l}</p>
              <p className="mt-2 text-2xl font-bold">{s.v}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle action={<Badge tone="brand">Term 2</Badge>}>Performance by Subject</SectionTitle>
          <div className="h-72">
            {marksLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer>
                <BarChart data={subjectMarks} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="s" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "var(--surface-100)" }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="m" fill="var(--brand-500)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <SectionTitle>Notifications</SectionTitle>
          <ul className="space-y-4">
            {(attendanceLoading || feesLoading) && (
              <li className="rounded-xl border border-border p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-3 w-48" />
              </li>
            )}
            {notifications.map((n, i) => (
              <motion.li
                key={n.t}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3"
              >
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                  n.tone === "danger" ? "bg-danger/10 text-danger" :
                  n.tone === "success" ? "bg-success/10 text-success" :
                  n.tone === "warning" ? "bg-warning/15 text-warning" : "bg-brand-50 text-brand-700"
                }`}>
                  <n.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{n.t}</p>
                  <p className="text-xs text-muted-foreground">{n.d}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>
    </RequireRole>
  );
}
