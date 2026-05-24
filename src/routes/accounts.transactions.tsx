import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { useCreatePayment, usePayments, useStudents } from "@/hooks/api-hooks";

export const Route = createFileRoute("/accounts/transactions")({
  head: () => ({ meta: [{ title: "Transactions — AetherLMS" }] }),
  component: AccountsTransactionsPage,
});

function AccountsTransactionsPage() {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const createPayment = useCreatePayment();
  const [form, setForm] = useState({
    student_id: "",
    amount: "",
    method: "Cash",
    date: new Date().toISOString().slice(0, 10),
    transaction_id: "",
  });

  const rows = useMemo(() => {
    return (payments ?? []).map((payment) => {
      const student = students?.find((item) => item.student_id === payment.student_id);
      return {
        ...payment,
        student_name: student?.name ?? payment.student_id,
        class_id: student?.class_id ?? "—",
      };
    });
  }, [payments, students]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    createPayment.mutate({
      student_id: form.student_id,
      amount: Number(form.amount),
      method: form.method,
      date: form.date,
      transaction_id: form.method === "UPI" ? form.transaction_id : undefined,
    });
    setForm((prev) => ({ ...prev, amount: "", transaction_id: "" }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" subtitle="Payments recorded in MongoDB" />
      <Card>
        <SectionTitle action={<Badge tone="brand">Record Payment</Badge>}>New Transaction</SectionTitle>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <select value={form.student_id} onChange={(e) => setForm((prev) => ({ ...prev, student_id: e.target.value }))} className="rounded-xl border border-border bg-card px-4 py-2 text-sm" required>
            <option value="">Select student</option>
            {(students ?? []).map((student) => (
              <option key={student.student_id} value={student.student_id}>{student.name} ({student.student_id})</option>
            ))}
          </select>
          <input value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))} type="number" min="1" className="rounded-xl border border-border bg-card px-4 py-2 text-sm" placeholder="Amount" required />
          <select value={form.method} onChange={(e) => setForm((prev) => ({ ...prev, method: e.target.value }))} className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="NetBanking">NetBanking</option>
          </select>
          <input value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} type="date" className="rounded-xl border border-border bg-card px-4 py-2 text-sm" required />
          {form.method === "UPI" && (
            <input
              value={form.transaction_id}
              onChange={(e) => setForm((prev) => ({ ...prev, transaction_id: e.target.value }))}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm md:col-span-2"
              placeholder="UPI transaction ID"
              required
            />
          )}
          <button type="submit" disabled={createPayment.isPending} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-brand-foreground md:col-span-2">
            {createPayment.isPending ? "Saving..." : "Save Transaction"}
          </button>
        </form>
      </Card>
      <SectionTitle action={<Badge tone="brand">{rows.length} payments</Badge>}>Payment History</SectionTitle>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Txn ID</th><th className="px-4 py-3">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(studentsLoading || paymentsLoading) && (
                <tr><td className="px-4 py-3 text-muted-foreground" colSpan={6}>Loading transactions...</td></tr>
              )}
              {!studentsLoading && !paymentsLoading && rows.length === 0 && (
                <tr><td className="px-4 py-3 text-muted-foreground" colSpan={6}>No payments found.</td></tr>
              )}
              {rows.map((payment) => (
                <tr key={`${payment.student_id}-${payment.date}`}>
                  <td className="px-4 py-3">{payment.student_name}</td>
                  <td className="px-4 py-3">{payment.class_id}</td>
                  <td className="px-4 py-3">{payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{payment.method}</td>
                  <td className="px-4 py-3">{payment.transaction_id ?? "-"}</td>
                  <td className="px-4 py-3">{new Date(payment.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}