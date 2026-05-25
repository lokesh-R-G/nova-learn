import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle } from "@/components/app/ui-bits";

export const Route = createFileRoute("/parent/")({
  head: () => ({ meta: [{ title: "Parent Dashboard — AetherLMS" }] }),
  component: ParentDashboardPage,
});

function ParentDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Parent Dashboard" subtitle="Overview of your child's progress" />
      <SectionTitle>Key Metrics</SectionTitle>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Child's Attendance</h3>
          <p className="text-2xl font-bold mt-2">--%</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Unread Notifications</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Recent Grades</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </Card>
      </div>
    </div>
  );
}