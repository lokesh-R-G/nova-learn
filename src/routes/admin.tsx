import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, Legend,
} from "recharts";
import { Download, Plus, MoreHorizontal, ArrowUpRight } from "lucide-react";
import {
  Card, PageHeader, PrimaryButton, SecondaryButton,
  SectionTitle, StatCard, Badge,
} from "@/components/app/ui-bits";
import { RequireRole } from "@/components/app/require-role";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeesQueries, useStudents, useTeachers } from "@/hooks/api-hooks";

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

const timetable = [
  { time: "08:30", subject: "Advanced Physics", room: "Lab 3 • Dr. Lee", grade: "12-B" },
  { time: "10:15", subject: "Calculus I", room: "Room 204 • Mrs. Park", grade: "11-A" },
  { time: "11:45", subject: "World History", room: "Room 112 • Mr. Vance", grade: "10-A" },
  { time: "13:30", subject: "Organic Chemistry", room: "Lab 1 • Dr. Singh", grade: "12-A" },
];

function AdminDashboard() {
  const { data: students, isLoading: studentsLoading, error: studentsError } = useStudents();
  const { data: teachers, isLoading: teachersLoading, error: teachersError } = useTeachers();
  const studentIds = useMemo(
    () => (students ?? []).slice(0, 40).map((s) => s.student_id),
    [students],
  );
  const feesQueries = useFeesQueries(studentIds);
  const feesData = feesQueries.map((q) => q.data).filter(Boolean);

  const totals = feesData.reduce(
    (acc, fee) => {
      acc.collected += fee.paid;
      acc.pending += fee.balance;
      acc.total += fee.total_fee;
      return acc;
    },
    { collected: 0, pending: 0, total: 0 },
  );

  const feeMix = [
    { name: "Collected", value: Math.round(totals.collected / 1000), color: "var(--brand-600)" },
    { name: "Pending", value: Math.round(totals.pending / 1000), color: "var(--warning)" },
    { name: "Overdue", value: 0, color: "var(--danger)" },
  ];

  const hasError = studentsError || teachersError || feesQueries.some((q) => q.isError);

  const recentFees = feesData.slice(0, 4).map((fee) => {
    const student = students?.find((s) => s.student_id === fee.student_id);
    return {
      id: fee.student_id,
      who: student?.name ?? fee.student_id,
      cat: "Tuition Fee",
      d: "—",
      amt: `$${fee.paid.toLocaleString()}.00`,
      s: fee.balance === 0 ? "Paid" : "Pending",
    };
  });

  return (
    <RequireRole roles={["admin"]}>
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

      {hasError && (
        <Card className="mb-6 border-danger/40 bg-danger/5">
          <p className="text-sm text-danger">Unable to load admin analytics.</p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <StatCard index={0} label="Total Teachers" value={teachersLoading ? "—" : `${teachers?.length ?? 0}`} delta="" progress={82} />
        <StatCard index={1} label="Total Students" value={studentsLoading ? "—" : `${students?.length ?? 0}`} delta="" progress={96} progressTone="success" />
        <StatCard index={2} label="Fee Realization" value={`$${Math.round(totals.collected / 1000)}k`} delta="" deltaTone="neutral" progress={78} progressTone="warning" />
        <StatCard index={3} label="Pending Balance" value={`$${Math.round(totals.pending / 1000)}k`} delta="" deltaTone="neutral" progress={70} />
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
              {feesQueries.some((q) => q.isLoading) ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={feeMix} dataKey="value" innerRadius={42} outerRadius={64} paddingAngle={3} stroke="none">
                      {feeMix.map((s) => <Cell key={s.name} fill={s.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
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
                {feesQueries.some((q) => q.isLoading) && (
                  <tr>
                    <td className="px-6 py-4" colSpan={7}>
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                )}
                {recentFees.map((t) => (
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
                {!feesQueries.some((q) => q.isLoading) && recentFees.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-center text-sm text-muted-foreground" colSpan={7}>
                      No fee records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </RequireRole>
  );
}
