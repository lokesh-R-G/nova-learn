import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle, CheckCircle2, Info, MessageSquare } from "lucide-react";
import { Card, PageHeader, SecondaryButton, SectionTitle, Badge } from "@/components/app/ui-bits";

export const Route = createFileRoute("/parent")({
  head: () => ({
    meta: [
      { title: "Parent Dashboard — AetherLMS" },
      { name: "description", content: "Your child's performance, attendance and notifications." },
    ],
  }),
  component: ParentDashboard,
});

const subjectMarks = [
  { s: "Math", m: 82 }, { s: "Physics", m: 88 }, { s: "Chem", m: 92 },
  { s: "Eng", m: 86 }, { s: "Hist", m: 70 }, { s: "Art", m: 95 },
];

const notifications = [
  { icon: AlertTriangle, tone: "danger" as const, t: "Absent on Oct 22", d: "No reason submitted • History class" },
  { icon: CheckCircle2, tone: "success" as const, t: "Chemistry result published", d: "Lab Report — 18/20" },
  { icon: Info, tone: "brand" as const, t: "Parent-Teacher meeting", d: "Saturday, Nov 4 at 10:00 AM" },
  { icon: AlertTriangle, tone: "warning" as const, t: "Q4 tuition due in 4 days", d: "$1,250.00 outstanding" },
];

function ParentDashboard() {
  return (
    <>
      <PageHeader
        title="Aria's overview"
        subtitle="Grade 11-A • Roll 11A-01"
        actions={<SecondaryButton><MessageSquare className="size-4" /> Message Teacher</SecondaryButton>}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {[
          { l: "Overall Grade", v: "A-", d: "Top 12%" },
          { l: "Attendance", v: "92%", d: "87/95 classes" },
          { l: "Assignments", v: "24/26", d: "92% on time" },
          { l: "Behaviour", v: "Excellent", d: "0 incidents" },
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
          </div>
        </Card>

        <Card>
          <SectionTitle>Notifications</SectionTitle>
          <ul className="space-y-4">
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
    </>
  );
}
