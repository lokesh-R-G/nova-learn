import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Check, Plus, FileText, Clock } from "lucide-react";
import { Card, PageHeader, PrimaryButton, SecondaryButton, SectionTitle, Badge } from "@/components/app/ui-bits";
import { cn } from "@/lib/utils";

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

const initialStudents = [
  { id: 1, name: "Aria Patel", roll: "11A-01" },
  { id: 2, name: "Bilal Ahmed", roll: "11A-02" },
  { id: 3, name: "Chloe Wright", roll: "11A-03" },
  { id: 4, name: "Diego Alvarez", roll: "11A-04" },
  { id: 5, name: "Emma Johansson", roll: "11A-05" },
  { id: 6, name: "Farah Naseer", roll: "11A-06" },
  { id: 7, name: "George Mensah", roll: "11A-07" },
  { id: 8, name: "Hana Suzuki", roll: "11A-08" },
];

function TeacherDashboard() {
  const [present, setPresent] = useState<Record<number, boolean>>({ 1: true, 2: true, 4: true, 5: true });
  const total = initialStudents.length;
  const count = Object.values(present).filter(Boolean).length;

  return (
    <>
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
            {initialStudents.map((s, i) => {
              const isPresent = !!present[s.id];
              return (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setPresent((p) => ({ ...p, [s.id]: !p[s.id] }))}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition",
                    isPresent
                      ? "border-success/30 bg-success/10"
                      : "border-border bg-card hover:border-brand-200",
                  )}
                >
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.roll}</p>
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
          <PrimaryButton className="mt-4 w-full">Save Attendance</PrimaryButton>
        </Card>

        <Card>
          <SectionTitle action={<button className="text-xs font-semibold text-brand-600">View all</button>}>
            Assignments to Grade
          </SectionTitle>
          <ul className="space-y-3">
            {[
              { t: "Wave Mechanics Worksheet", c: "Physics • 12-B", sub: 22, total: 28, due: "Today" },
              { t: "Integral Calculus Set 4", c: "Math • 11-A", sub: 18, total: 30, due: "Tomorrow" },
              { t: "Lab Report — Ohm's Law", c: "Physics • 10-A", sub: 14, total: 26, due: "3d left" },
            ].map((a) => (
              <li key={a.t} className="rounded-xl border border-border p-4 transition hover:border-brand-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{a.t}</p>
                    <p className="text-xs text-muted-foreground">{a.c}</p>
                  </div>
                  <Badge tone={a.due === "Today" ? "danger" : "neutral"}>
                    <Clock className="mr-1 inline size-3" />{a.due}
                  </Badge>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Submissions</span>
                    <span className="font-semibold">{a.sub}/{a.total}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${(a.sub / a.total) * 100}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
