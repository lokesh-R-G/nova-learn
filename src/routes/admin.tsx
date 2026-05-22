import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, Legend,
} from "recharts";
import { Download, Plus, MoreHorizontal, ArrowUpRight } from "lucide-react";
import {
  Card, PageHeader, PrimaryButton, SecondaryButton,
  SectionTitle, StatCard, Badge,
} from "@/components/app/ui-bits";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — AetherLMS" },
      { name: "description", content: "Institutional overview, faculty performance and finance analytics." },
    ],
  }),
  component: AdminDashboard,
});

const perfData = [
  { m: "Jan", current: 78, previous: 70 },
  { m: "Feb", current: 82, previous: 73 },
  { m: "Mar", current: 80, previous: 75 },
  { m: "Apr", current: 86, previous: 78 },
  { m: "May", current: 90, previous: 80 },
  { m: "Jun", current: 88, previous: 82 },
  { m: "Jul", current: 93, previous: 85 },
];

const classData = [
  { c: "9-A", avg: 84 }, { c: "9-B", avg: 79 }, { c: "10-A", avg: 88 },
  { c: "10-B", avg: 82 }, { c: "11-A", avg: 91 }, { c: "11-B", avg: 76 },
  { c: "12-A", avg: 87 }, { c: "12-B", avg: 80 },
];

const feeMix = [
  { name: "Collected", value: 842, color: "var(--brand-600)" },
  { name: "Pending", value: 138, color: "var(--warning)" },
  { name: "Overdue", value: 42, color: "var(--danger)" },
];

const timetable = [
  { time: "08:30", subject: "Advanced Physics", room: "Lab 3 • Dr. Lee", grade: "12-B" },
  { time: "10:15", subject: "Calculus I", room: "Room 204 • Mrs. Park", grade: "11-A" },
  { time: "11:45", subject: "World History", room: "Room 112 • Mr. Vance", grade: "10-A" },
  { time: "13:30", subject: "Organic Chemistry", room: "Lab 1 • Dr. Singh", grade: "12-A" },
];

function AdminDashboard() {
  return (
    <>
      <PageHeader
        title="Institutional Overview"
        subtitle="Performance analytics for Q3 Academic Cycle"
        actions={
          <>
            <SecondaryButton><Download className="size-4" /> Export PDF</SecondaryButton>
            <PrimaryButton><Plus className="size-4" /> Generate Report</PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <StatCard index={0} label="Avg. Teacher Score" value="4.82" delta="+12%" progress={82} />
        <StatCard index={1} label="Student Retention" value="96.4%" delta="+0.8%" progress={96} progressTone="success" />
        <StatCard index={2} label="Fee Realization" value="$842k" delta="Target $900k" deltaTone="neutral" progress={78} progressTone="warning" />
        <StatCard index={3} label="Active Classes" value="124" delta="Live Now" deltaTone="neutral" progress={70} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle action={<Badge tone="brand">Last 7 months</Badge>}>
            Teacher Performance
          </SectionTitle>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={perfData} margin={{ left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-500)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--brand-500)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="previous" stroke="var(--muted-foreground)" strokeDasharray="4 4" fill="transparent" />
                <Area type="monotone" dataKey="current" stroke="var(--brand-600)" strokeWidth={2.5} fill="url(#cg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle>Today's Schedule</SectionTitle>
          <ul className="space-y-3">
            {timetable.map((t, i) => (
              <motion.li
                key={t.time}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex gap-3 rounded-xl border border-border p-3 transition hover:border-brand-200 hover:bg-brand-50/30"
              >
                <div className="w-12 shrink-0 text-center">
                  <div className="text-xs font-bold text-brand-600">{t.time}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">{t.grade}</div>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.room}</p>
                </div>
              </motion.li>
            ))}
          </ul>
          <button className="mt-4 w-full rounded-lg bg-secondary py-2 text-xs font-bold text-foreground hover:bg-surface-200">
            View Full Timetable
          </button>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle action={<button className="text-xs font-semibold text-brand-600">View all</button>}>
            Class Performance
          </SectionTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} margin={{ left: -20, right: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="c" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "var(--surface-100)" }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="avg" fill="var(--brand-500)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle>Fee Summary</SectionTitle>
          <div className="flex items-center gap-4">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={feeMix} dataKey="value" innerRadius={42} outerRadius={64} paddingAngle={3} stroke="none">
                    {feeMix.map((s) => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {feeMix.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-muted-foreground">{s.name}</span>
                  </div>
                  <span className="font-semibold">${s.value}k</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h3 className="font-bold">Recent Transactions</h3>
              <p className="text-xs text-muted-foreground">Latest fee activity across the institution</p>
            </div>
            <button className="text-sm font-semibold text-brand-600 hover:underline">
              <span className="inline-flex items-center gap-1">View all <ArrowUpRight className="size-3.5" /></span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Transaction</th>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { id: "TRX-9821", who: "Liam Peterson", cat: "Tuition Fee", d: "Oct 23", amt: "$3,400.00", s: "Paid" },
                  { id: "TRX-9784", who: "Maya Rodriguez", cat: "Lab Kit", d: "Oct 22", amt: "$120.00", s: "Pending" },
                  { id: "TRX-9712", who: "Noah Kim", cat: "Tuition Fee", d: "Oct 21", amt: "$3,400.00", s: "Paid" },
                  { id: "TRX-9655", who: "Sophia Hayes", cat: "Sports", d: "Oct 20", amt: "$220.00", s: "Overdue" },
                ].map((t) => (
                  <tr key={t.id} className="transition hover:bg-surface-50">
                    <td className="px-6 py-4 font-mono text-xs">#{t.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-brand-600 text-[10px] font-bold text-brand-foreground">
                          {t.who.split(" ").map((x) => x[0]).join("")}
                        </div>
                        <span className="font-medium">{t.who}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{t.cat}</td>
                    <td className="px-6 py-4 text-muted-foreground">{t.d}</td>
                    <td className="px-6 py-4 font-semibold">{t.amt}</td>
                    <td className="px-6 py-4">
                      <Badge tone={t.s === "Paid" ? "success" : t.s === "Pending" ? "warning" : "danger"}>{t.s}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-md p-1 text-muted-foreground hover:bg-secondary"><MoreHorizontal className="size-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
