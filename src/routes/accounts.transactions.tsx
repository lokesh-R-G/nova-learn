import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { usePayments, useStudents } from "@/hooks/api-hooks";

export const Route = createFileRoute("/accounts/transactions")({
  head: () => ({ meta: [{ title: "Transactions — AetherLMS" }] }),
  component: AccountsTransactionsPage,
});

function AccountsTransactionsPage() {
  const { data: students } = useStudents();
  const { data: payments } = usePayments();

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

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" subtitle="Payments recorded in MongoDB" />
      <SectionTitle action={<Badge tone="brand">{rows.length} payments</Badge>}>Payment History</SectionTitle>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((payment) => (
                <tr key={`${payment.student_id}-${payment.date}`}>
                  <td className="px-4 py-3">{payment.student_name}</td>
                  <td className="px-4 py-3">{payment.class_id}</td>
                  <td className="px-4 py-3">{payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{payment.method}</td>
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