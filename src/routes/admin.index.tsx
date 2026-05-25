import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle } from "@/components/app/ui-bits";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — AetherLMS" }] }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" subtitle="Overview of institutional metrics" />
      <SectionTitle>Key Metrics</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Total Staff</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Current Term Attendance</h3>
          <p className="text-2xl font-bold mt-2">--%</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Active Alerts</h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </Card>
      </div>
    </div>
  );
}