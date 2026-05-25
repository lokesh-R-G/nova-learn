import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle } from "@/components/app/ui-bits";

export const Route = createFileRoute("/accounts/")({
  head: () => ({ meta: [{ title: "Accounts Dashboard — AetherLMS" }] }),
  component: AccountsDashboardPage,
});

function AccountsDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Financial Ledger" subtitle="Overview of financial transactions" />
      <SectionTitle>Key Metrics</SectionTitle>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">$0.00</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Pending Fees</h3>
          <p className="text-2xl font-bold mt-2">$0.00</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Recent Transactions</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </Card>
      </div>
    </div>
  );
}