import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Filter, ArrowUpDown } from "lucide-react";
import { Card, PageHeader, PrimaryButton, SecondaryButton, SectionTitle, Badge, StatCard } from "@/components/app/ui-bits";
import { cn } from "@/lib/utils";
import { RequireRole } from "@/components/app/require-role";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreatePayment, useFeesQueries, useStudents } from "@/hooks/api-hooks";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts Dashboard — AetherLMS" },
      { name: "description", content: "Fee ledger, payments and transaction history." },
    ],
  }),
  component: AccountsDashboard,
});

type Status = "Paid" | "Pending" | "Overdue";
type Row = { id: string; student: string; class: string; category: string; date: string; amount: number; status: Status };

function AccountsDashboard() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | Status>("All");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const { data: students, isLoading: studentsLoading, error: studentsError } = useStudents();
  const studentIds = useMemo(
    () => (students ?? []).slice(0, 30).map((s) => s.student_id),
    [students],
  );
  const feesQueries = useFeesQueries(studentIds);
  const { mutateAsync, isPending: paymentPending } = useCreatePayment();

  const feesData = feesQueries
    .map((q) => q.data)
    .filter((fee): fee is NonNullable<typeof fee> => Boolean(fee));

  const rowsBase = feesData.map((fee) => {
    const student = students?.find((s) => s.student_id === fee.student_id);
    const status: Status = fee.balance === 0 ? "Paid" : fee.balance > 0 ? "Pending" : "Overdue";
    return {
      id: fee.student_id,
      student: student?.name ?? fee.student_id,
      class: student?.class_id ?? "—",
      category: "Total Fee",
      date: "—",
      amount: fee.total_fee,
      status,
    } as Row;
  });

  const rows = useMemo(() => {
    let r = rowsBase.filter((x) =>
      (status === "All" || x.status === status) &&
      (q === "" || [x.student, x.id, x.category, x.class].some((f) => f.toLowerCase().includes(q.toLowerCase()))),
    );
    r = [...r].sort((a, b) => sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount);
    return r;
  }, [q, status, sortDir, rowsBase]);

  const totals = feesData.reduce(
    (acc, fee) => {
      acc.collected += fee.paid;
      acc.pending += fee.balance;
      return acc;
    },
    { collected: 0, pending: 0 },
  );

  async function recordPayment() {
    const studentId = window.prompt("Student ID (e.g., ST0001)")?.trim();
    if (!studentId) return;
    const amountValue = window.prompt("Amount paid")?.trim();
    if (!amountValue) return;
    const method = window.prompt("Method (Cash/Card/UPI)")?.trim() || "Cash";
    const amount = Number(amountValue);
    if (Number.isNaN(amount)) return;
    await mutateAsync({
      student_id: studentId,
      amount,
      method,
      date: new Date().toISOString(),
    });
  }

  const hasError = studentsError || feesQueries.some((q) => q.isError);

  return (
    <RequireRole roles={["accounts", "admin"]}>
      <PageHeader
        title="Financial Ledger"
        subtitle="Manage fees, payments and reconciliation"
        actions={
          <>
            <SecondaryButton><Download className="size-4" /> Export CSV</SecondaryButton>
            <PrimaryButton onClick={recordPayment} disabled={paymentPending}>Record Payment</PrimaryButton>
          </>
        }
      />

      {hasError && (
        <Card className="mb-6 border-danger/40 bg-danger/5">
          <p className="text-sm text-danger">Unable to load accounts data.</p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <StatCard index={0} label="Collected" value={`$${Math.round(totals.collected).toLocaleString()}`} delta="" progress={84} progressTone="success" />
        <StatCard index={1} label="Pending" value={`$${Math.round(totals.pending).toLocaleString()}`} delta={`${rows.length} records`} deltaTone="neutral" progress={45} progressTone="warning" />
        <StatCard index={2} label="Overdue" value="$0" delta="No overdue flagged" deltaTone="negative" progress={12} progressTone="danger" />
        <StatCard index={3} label="Refunds" value="$0" delta="—" deltaTone="neutral" progress={8} />
      </div>

      <Card className="mt-8 overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-border px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search student, ID, category…"
              className="w-full rounded-full border border-border bg-card py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            {(["All", "Paid", "Pending", "Overdue"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  status === s ? "bg-brand-600 text-brand-foreground" : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >{s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">
                  <button onClick={() => setSortDir((d) => d === "desc" ? "asc" : "desc")} className="inline-flex items-center gap-1 hover:text-foreground">
                    Amount <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {studentsLoading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={`row-skel-${i}`}>
                  <td className="px-6 py-4" colSpan={7}>
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))}
              {rows.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="hover:bg-surface-50"
                >
                  <td className="px-6 py-4 font-mono text-xs">#{r.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-brand-600 text-[10px] font-bold text-brand-foreground">
                        {r.student.split(" ").map((x) => x[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{r.student}</p>
                        <p className="text-[10px] text-muted-foreground">Grade {r.class}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{r.category}</td>
                  <td className="px-6 py-4 text-muted-foreground">{r.date}</td>
                  <td className="px-6 py-4 font-semibold">${r.amount.toLocaleString()}.00</td>
                  <td className="px-6 py-4">
                    <Badge tone={r.status === "Paid" ? "success" : r.status === "Pending" ? "warning" : "danger"}>{r.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-brand-600 hover:underline">Receipt</button>
                  </td>
                </motion.tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">No transactions match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Outlet />
      </RequireRole>
  );
}
