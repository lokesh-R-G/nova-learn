import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Check, Plus, FileText, Clock } from "lucide-react";
import { Card, PageHeader, PrimaryButton, SecondaryButton, SectionTitle, Badge } from "@/components/app/ui-bits";
import { cn } from "@/lib/utils";
import { RequireRole } from "@/components/app/require-role";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveTeacherClassId } from "@/lib/defaults";
import { useAssignments, useCreateAttendance, useStudentsByClass } from "@/hooks/api-hooks";

export const Route = createFileRoute("/teacher")({
  head: () => ({
    meta: [
      { title: "Teacher Dashboard — AetherLMS" },
      { name: "description", content: "Today's schedule, assignments and attendance." },
    ],
  }),
  component: TeacherDashboard,
});

const trend = [
  { w: "W1", score: 72 }, { w: "W2", score: 76 }, { w: "W3", score: 74 },
  { w: "W4", score: 81 }, { w: "W5", score: 85 }, { w: "W6", score: 88 },
];

function TeacherDashboard() {
  const classId = resolveTeacherClassId();
  const { data: students, isLoading: studentsLoading, error: studentsError } = useStudentsByClass(classId);
  const { data: assignments, isLoading: assignmentsLoading, error: assignmentsError } = useAssignments(classId);
  const { mutateAsync, isPending } = useCreateAttendance();

  const [present, setPresent] = useState<Record<string, boolean>>({});
  const total = students?.length ?? 0;
  const count = Object.values(present).filter(Boolean).length;

  const visibleAssignments = useMemo(() => (assignments ?? []).slice(0, 3), [assignments]);
  const hasError = studentsError || assignmentsError;

  useEffect(() => {
    if (students?.length && Object.keys(present).length === 0) {
      const initial = Object.fromEntries(students.map((s) => [s.student_id, true]));
      setPresent(initial);
    }
  }, [students, present]);

  async function saveAttendance() {
    if (!students?.length) return;
    const date = new Date().toISOString();
    await Promise.all(
      students.map((s) =>
        mutateAsync({
          student_id: s.student_id,
          class_id: s.class_id,
          date,
          status: present[s.student_id] ? "present" : "absent",
        }),
      ),
    );
  }

  return (
    <RequireRole roles={["teacher", "admin"]}>
      <PageHeader
        title="Good morning, Daniel"
        subtitle="You have 4 classes and 2 assignments to grade today."
        actions={
          <>
            <SecondaryButton><FileText className="size-4" /> New Lesson Plan</SecondaryButton>
            <PrimaryButton><Plus className="size-4" /> Create Assignment</PrimaryButton>
          </>
        }
      />

      {hasError && (
        <Card className="mb-6 border-danger/40 bg-danger/5">
          <p className="text-sm text-danger">Unable to load class data.</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle action={<Badge tone="brand">Today, Oct 24</Badge>}>Class Schedule</SectionTitle>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-4 py-3">Period</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { t: "08:30", s: "Advanced Physics", g: "12-B", st: "Completed" },
                  { t: "10:15", s: "Calculus I", g: "11-A", st: "Live" },
                  { t: "11:45", s: "Physics Lab", g: "10-A", st: "Up Next" },
                  { t: "13:30", s: "Mentor Hour", g: "—", st: "Scheduled" },
                ].map((r) => (
                  <tr key={r.t} className="hover:bg-surface-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold">{r.t}</td>
                    <td className="px-4 py-3 font-semibold">{r.s}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.g}</td>
                    <td className="px-4 py-3">
                      <Badge tone={r.st === "Completed" ? "success" : r.st === "Live" ? "brand" : "neutral"}>{r.st}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <SectionTitle>Class 11-A Trend</SectionTitle>
          <div className="h-44">
            <ResponsiveContainer>
              <LineChart data={trend} margin={{ left: -20, right: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="w" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="var(--brand-600)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--brand-600)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-success/10 px-3 py-2 text-xs">
            <span className="font-semibold text-success">Improving steadily</span>
            <span className="text-muted-foreground">+16 pts in 6 weeks</span>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle action={<span className="text-xs font-semibold text-muted-foreground">{count}/{total} present</span>}>
            Quick Attendance — 11-A
          </SectionTitle>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
            {studentsLoading && Array.from({ length: 6 }).map((_, i) => (
              <div key={`student-skel-${i}`} className="rounded-xl border border-border p-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-2 h-3 w-16" />
              </div>
            ))}
            {(students ?? []).map((s, i) => {
              const isPresent = !!present[s.student_id];
              return (
                <motion.button
                  key={s.student_id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setPresent((p) => ({ ...p, [s.student_id]: !p[s.student_id] }))}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition",
                    isPresent
                      ? "border-success/30 bg-success/10"
                      : "border-border bg-card hover:border-brand-200",
                  )}
                >
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.class_id}</p>
                  </div>
                  <span className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs",
                    isPresent ? "bg-success text-success-foreground" : "border border-border text-muted-foreground",
                  )}>
                    {isPresent ? <Check className="size-3.5" /> : ""}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <PrimaryButton className="mt-4 w-full" onClick={saveAttendance} disabled={isPending || studentsLoading}>
            {isPending ? "Saving..." : "Save Attendance"}
          </PrimaryButton>
        </Card>

        <Card>
          <SectionTitle action={<button className="text-xs font-semibold text-brand-600">View all</button>}>
            Assignments to Grade
          </SectionTitle>
          <ul className="space-y-3">
            {assignmentsLoading && Array.from({ length: 3 }).map((_, i) => (
              <li key={`assign-skel-${i}`} className="rounded-xl border border-border p-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-3 w-24" />
              </li>
            ))}
            {visibleAssignments.map((a, idx) => (
              <li key={a.assignment_id} className="rounded-xl border border-border p-4 transition hover:border-brand-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.subject} • {a.class_id}</p>
                  </div>
                  <Badge tone={idx === 0 ? "danger" : "neutral"}>
                    <Clock className="mr-1 inline size-3" />Due soon
                  </Badge>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Submissions</span>
                    <span className="font-semibold">—</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: "40%" }} />
                  </div>
                </div>
              </li>
            ))}
            {!assignmentsLoading && visibleAssignments.length === 0 && (
              <li className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
                No assignments found for this class.
              </li>
            )}
          </ul>
        </Card>
      </div>

      <Outlet />
    </RequireRole>
  );
}
