import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle } from "@/components/app/ui-bits";

export const Route = createFileRoute("/teacher/")({
  head: () => ({ meta: [{ title: "Teacher Dashboard — AetherLMS" }] }),
  component: TeacherDashboardPage,
});

function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Teacher Dashboard" subtitle="Overview of your classes and tasks" />
      <SectionTitle>Key Metrics</SectionTitle>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Today's Classes</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Pending Assignments to Grade</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Class Average Attendance</h3>
          <p className="text-2xl font-bold mt-2">--%</p>
        </Card>
      </div>
    </div>
  );
}