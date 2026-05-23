import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Atom, Calculator, Globe, FlaskConical, Languages, Palette, Upload, Sparkles } from "lucide-react";
import { Card, PageHeader, PrimaryButton, SectionTitle, Badge } from "@/components/app/ui-bits";
import { Skeleton } from "@/components/ui/skeleton";
import { RequireRole } from "@/components/app/require-role";
import { useAuth } from "@/hooks/use-auth";
import { resolveStudentId } from "@/lib/defaults";
import { useAssignments, useAttendance, useMarks, useStudent } from "@/hooks/api-hooks";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — AetherLMS" },
      { name: "description", content: "Your subjects, progress, attendance and assignments." },
    ],
  }),
  component: StudentDashboard,
});

const SUBJECT_STYLES: Record<string, { icon: typeof Atom; tint: string }> = {
  Physics: { icon: Atom, tint: "from-blue-400 to-indigo-600" },
  Mathematics: { icon: Calculator, tint: "from-violet-400 to-fuchsia-600" },
  Science: { icon: FlaskConical, tint: "from-emerald-400 to-teal-600" },
  Chemistry: { icon: FlaskConical, tint: "from-emerald-400 to-teal-600" },
  "World History": { icon: Globe, tint: "from-amber-400 to-orange-600" },
  English: { icon: Languages, tint: "from-rose-400 to-pink-600" },
  "English Lit.": { icon: Languages, tint: "from-rose-400 to-pink-600" },
  "Art & Design": { icon: Palette, tint: "from-cyan-400 to-blue-600" },
};

function gradeLetter(percent: number) {
  if (percent >= 90) return "A";
  if (percent >= 80) return "B";
  if (percent >= 70) return "C";
  if (percent >= 60) return "D";
  return "F";
}

function CircularAttendance({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative size-36">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} stroke="var(--surface-200)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="60" cy="60" r={r} stroke="var(--brand-600)" strokeWidth="10" fill="none"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{value}%</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Attendance</span>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const { auth } = useAuth();
  const studentId = resolveStudentId(auth);
  const {
    data: student,
    isLoading: studentLoading,
    error: studentError,
  } = useStudent(studentId);
  const classId = student?.class_id;
  const {
    data: marks,
    isLoading: marksLoading,
    error: marksError,
  } = useMarks(studentId);
  const {
    data: attendance,
    isLoading: attendanceLoading,
    error: attendanceError,
  } = useAttendance(studentId);
  const {
    data: assignments,
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useAssignments(classId);

  const attendanceStats = useMemo(() => {
    const total = attendance?.length ?? 0;
    const present = attendance?.filter((r) => r.status === "present").length ?? 0;
    const percent = total ? Math.round((present / total) * 100) : 0;
    return { total, present, percent };
  }, [attendance]);

  const marksBySubject = useMemo(() => {
    const map = new Map<string, { total: number; max: number }>();
    (marks ?? []).forEach((m) => {
      const key = m.subject;
      const existing = map.get(key) ?? { total: 0, max: 0 };
      map.set(key, { total: existing.total + m.marks, max: existing.max + m.max_marks });
    });
    return Array.from(map.entries()).map(([subject, totals]) => {
      const percent = totals.max ? Math.round((totals.total / totals.max) * 100) : 0;
      const style = SUBJECT_STYLES[subject] ?? { icon: Sparkles, tint: "from-slate-400 to-slate-600" };
      return {
        name: subject,
        grade: gradeLetter(percent),
        progress: percent,
        icon: style.icon,
        tint: style.tint,
      };
    });
  }, [marks]);

  const marksChart = useMemo(() => {
    if (!marks?.length) return [];
    const map = new Map<string, { total: number; max: number }>();
    marks.forEach((m) => {
      const key = m.exam;
      const existing = map.get(key) ?? { total: 0, max: 0 };
      map.set(key, { total: existing.total + m.marks, max: existing.max + m.max_marks });
    });
    return Array.from(map.entries()).map(([exam, totals]) => ({
      t: exam,
      v: totals.max ? Math.round((totals.total / totals.max) * 100) : 0,
    }));
  }, [marks]);

  const hasError = studentError || marksError || attendanceError || assignmentsError;

  return (
    <RequireRole roles={["student", "admin"]}>
      <Card className="mb-6 overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-700 text-brand-foreground">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm opacity-80">Wednesday, October 24</p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">
              Welcome back, {student?.name ?? "Student"} 👋
            </h1>
            <p className="mt-1 text-sm opacity-80">You have 2 assignments due this week. Keep up the streak!</p>
          </div>
          <div className="flex gap-4">
            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs opacity-80">Current GPA</p>
              <p className="text-2xl font-bold">3.78</p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs opacity-80">Streak</p>
              <p className="text-2xl font-bold">14 days</p>
            </div>
          </div>
        </div>
      </Card>

      {hasError && (
        <Card className="mb-6 border-danger/40 bg-danger/5">
          <p className="text-sm text-danger">
            We could not load some student data. Please refresh or try again.
          </p>
        </Card>
      )}

      <SectionTitle action={<button className="text-xs font-semibold text-brand-600">View all</button>}>
        My Subjects
      </SectionTitle>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {marksLoading && Array.from({ length: 6 }).map((_, i) => (
          <Card key={`subject-skel-${i}`} hoverable className="space-y-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-2 w-full" />
          </Card>
        ))}
        {!marksLoading && marksBySubject.length === 0 && (
          <Card className="col-span-full">
            <p className="text-sm text-muted-foreground">No subjects found yet.</p>
          </Card>
        )}
        {marksBySubject.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card hoverable className="cursor-pointer">
              <div className="flex items-center justify-between">
                <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.tint} text-white shadow-sm`}>
                  <s.icon className="size-5" />
                </div>
                <Badge tone="brand">{s.grade}</Badge>
              </div>
              <p className="mt-4 font-semibold">{s.name}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-brand-500"
                  initial={{ width: 0 }} animate={{ width: `${s.progress}%` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{s.progress}% complete</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle>Marks Over Time</SectionTitle>
          <div className="h-64">
            {marksLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer>
                <LineChart data={marksChart} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="v" stroke="var(--brand-600)" strokeWidth={3} dot={{ r: 4, fill: "var(--brand-600)" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center">
          <SectionTitle>This Term</SectionTitle>
          {attendanceLoading ? (
            <Skeleton className="h-36 w-36 rounded-full" />
          ) : (
            <CircularAttendance value={attendanceStats.percent} />
          )}
          <p className="mt-3 text-sm text-muted-foreground">
            {attendanceStats.present} of {attendanceStats.total} classes attended
          </p>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <SectionTitle action={<PrimaryButton><Upload className="size-4" /> Submit New</PrimaryButton>}>
            Pending Assignments
          </SectionTitle>
          <div className="grid gap-3 md:grid-cols-2">
            {assignmentsLoading && Array.from({ length: 4 }).map((_, i) => (
              <div key={`assign-skel-${i}`} className="rounded-xl border border-border p-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
            ))}
            {!assignmentsLoading && (assignments ?? []).slice(0, 4).map((a, idx) => (
              <div key={a.assignment_id} className="flex items-center justify-between rounded-xl border border-border p-4 transition hover:border-brand-200">
                <div>
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.subject}</p>
                </div>
                <Badge tone={idx === 0 ? "danger" : idx === 1 ? "warning" : "neutral"}>Due soon</Badge>
              </div>
            ))}
            {!assignmentsLoading && (assignments ?? []).length === 0 && (
              <div className="col-span-full rounded-xl border border-border p-4 text-sm text-muted-foreground">
                No assignments found for your class.
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 relative overflow-hidden bg-foreground text-background">
        <div className="absolute -right-20 -bottom-20 size-64 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-500">
              <Sparkles className="size-5 text-brand-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold opacity-80">Aether AI · Learning Assistant</p>
              <p className="text-lg font-bold">Need help with Integral Calculus? I've got 8 practice problems ready.</p>
            </div>
          </div>
          <PrimaryButton>Open Assistant</PrimaryButton>
        </div>
      </Card>
    </RequireRole>
  );
}
