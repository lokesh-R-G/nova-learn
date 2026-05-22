import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Filter, ArrowUpDown } from "lucide-react";
import { Card, PageHeader, PrimaryButton, SecondaryButton, SectionTitle, Badge, StatCard } from "@/components/app/ui-bits";
import { cn } from "@/lib/utils";

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

const ROWS: Row[] = [
  { id: "TRX-9821", student: "Liam Peterson", class: "12-A", category: "Tuition Fee", date: "2024-10-23", amount: 3400, status: "Paid" },
  { id: "TRX-9784", student: "Maya Rodriguez", class: "10-B", category: "Lab Kit", date: "2024-10-22", amount: 120, status: "Pending" },
  { id: "TRX-9712", student: "Noah Kim", class: "11-A", category: "Tuition Fee", date: "2024-10-21", amount: 3400, status: "Paid" },
  { id: "TRX-9655", student: "Sophia Hayes", class: "9-C", category: "Sports", date: "2024-10-20", amount: 220, status: "Overdue" },
  { id: "TRX-9601", student: "Ethan Brooks", class: "12-B", category: "Tuition Fee", date: "2024-10-18", amount: 3400, status: "Paid" },
  { id: "TRX-9544", student: "Isla Tanaka", class: "11-B", category: "Library", date: "2024-10-17", amount: 60, status: "Pending" },
  { id: "TRX-9501", student: "Mateo Silva", class: "10-A", category: "Transport", date: "2024-10-15", amount: 450, status: "Paid" },
  { id: "TRX-9478", student: "Olivia Park", class: "12-A", category: "Tuition Fee", date: "2024-10-14", amount: 3400, status: "Overdue" },
];

function AccountsDashboard() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"All" | Status>("All");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const rows = useMemo(() => {
    let r = ROWS.filter((x) =>
      (status === "All" || x.status === status) &&
      (q === "" || [x.student, x.id, x.category, x.class].some((f) => f.toLowerCase().includes(q.toLowerCase()))),
    );
    r = [...r].sort((a, b) => sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount);
    return r;
  }, [q, status, sortDir]);

  return (
    <>
      <PageHeader
        title="Financial Ledger"
        subtitle="Manage fees, payments and reconciliation"
        actions={
          <>
            <SecondaryButton><Download className="size-4" /> Export CSV</SecondaryButton>
            <PrimaryButton>Record Payment</PrimaryButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <StatCard index={0} label="Collected (MTD)" value="$842k" delta="+12%" progress={84} progressTone="success" />
        <StatCard index={1} label="Pending" value="$138k" delta="42 invoices" deltaTone="neutral" progress={45} progressTone="warning" />
        <StatCard index={2} label="Overdue" value="$42k" delta="8 invoices" deltaTone="negative" progress={28} progressTone="danger" />
        <StatCard index={3} label="Refunds" value="$3.2k" delta="—" deltaTone="neutral" progress={8} />
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
    </>
  );
}
