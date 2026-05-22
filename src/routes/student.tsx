import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Atom, Calculator, Globe, FlaskConical, Languages, Palette, Upload, Sparkles } from "lucide-react";
import { Card, PageHeader, PrimaryButton, SectionTitle, Badge } from "@/components/app/ui-bits";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — AetherLMS" },
      { name: "description", content: "Your subjects, progress, attendance and assignments." },
    ],
  }),
  component: StudentDashboard,
});

const subjects = [
  { name: "Physics", grade: "A-", progress: 88, icon: Atom, tint: "from-blue-400 to-indigo-600" },
  { name: "Mathematics", grade: "B+", progress: 75, icon: Calculator, tint: "from-violet-400 to-fuchsia-600" },
  { name: "Chemistry", grade: "A", progress: 92, icon: FlaskConical, tint: "from-emerald-400 to-teal-600" },
  { name: "World History", grade: "B", progress: 70, icon: Globe, tint: "from-amber-400 to-orange-600" },
  { name: "English Lit.", grade: "A-", progress: 86, icon: Languages, tint: "from-rose-400 to-pink-600" },
  { name: "Art & Design", grade: "A", progress: 95, icon: Palette, tint: "from-cyan-400 to-blue-600" },
];

const marks = [
  { t: "T1", v: 72 }, { t: "T2", v: 78 }, { t: "T3", v: 81 },
  { t: "T4", v: 85 }, { t: "T5", v: 88 }, { t: "T6", v: 91 },
];

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
  return (
    <>
      <Card className="mb-6 overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-700 text-brand-foreground">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm opacity-80">Wednesday, October 24</p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">Welcome back, Aria 👋</h1>
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

      <SectionTitle action={<button className="text-xs font-semibold text-brand-600">View all</button>}>
        My Subjects
      </SectionTitle>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {subjects.map((s, i) => (
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
            <ResponsiveContainer>
              <LineChart data={marks} margin={{ left: -20, right: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke="var(--brand-600)" strokeWidth={3} dot={{ r: 4, fill: "var(--brand-600)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center">
          <SectionTitle>This Term</SectionTitle>
          <CircularAttendance value={92} />
          <p className="mt-3 text-sm text-muted-foreground">87 of 95 classes attended</p>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <SectionTitle action={<PrimaryButton><Upload className="size-4" /> Submit New</PrimaryButton>}>
            Pending Assignments
          </SectionTitle>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { t: "Integral Calculus — Set 4", c: "Mathematics", due: "Tomorrow", tone: "danger" as const },
              { t: "Photosynthesis Essay", c: "Biology", due: "3 days", tone: "warning" as const },
              { t: "Newton's Laws Worksheet", c: "Physics", due: "5 days", tone: "neutral" as const },
              { t: "French Vocabulary Quiz", c: "Languages", due: "1 week", tone: "neutral" as const },
            ].map((a) => (
              <div key={a.t} className="flex items-center justify-between rounded-xl border border-border p-4 transition hover:border-brand-200">
                <div>
                  <p className="font-semibold">{a.t}</p>
                  <p className="text-xs text-muted-foreground">{a.c}</p>
                </div>
                <Badge tone={a.tone}>Due in {a.due}</Badge>
              </div>
            ))}
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
    </>
  );
}
