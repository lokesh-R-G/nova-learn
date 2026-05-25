import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle } from "@/components/app/ui-bits";

export const Route = createFileRoute("/student/")({
  head: () => ({ meta: [{ title: "Student Dashboard — AetherLMS" }] }),
  component: StudentDashboardPage,
});

function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Student Dashboard" subtitle="Overview of your academic progress" />
      <SectionTitle>Key Metrics</SectionTitle>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Upcoming Assignments</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Overall Attendance</h3>
          <p className="text-2xl font-bold mt-2">--%</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-muted-foreground">Recent Grades</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </Card>
      </div>
    </div>
  );
}