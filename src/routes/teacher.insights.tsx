import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { resolveTeacherClassId } from "@/lib/defaults";
import { useClassAnalytics } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/teacher/insights")({
  head: () => ({ meta: [{ title: "Class Insights — AetherLMS" }] }),
  component: TeacherInsightsPage,
});

function TeacherInsightsPage() {
  const classId = resolveTeacherClassId();
  const { data: analytics, isLoading, isError } = useClassAnalytics(classId);

  return (
    <div className="space-y-6">
      <PageHeader title="Class Insights" subtitle={`Analytics for ${classId}`} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card><p className="text-xs uppercase text-muted-foreground">Students</p><p className="mt-2 text-2xl font-bold">{analytics?.student_count ?? 0}</p></Card>
        <Card><p className="text-xs uppercase text-muted-foreground">Attendance</p><p className="mt-2 text-2xl font-bold">{analytics?.attendance_rate ?? 0}%</p></Card>
        <Card><p className="text-xs uppercase text-muted-foreground">Avg Score</p><p className="mt-2 text-2xl font-bold">{analytics?.average_score ?? 0}%</p></Card>
        <Card><p className="text-xs uppercase text-muted-foreground">Assignments</p><p className="mt-2 text-2xl font-bold">{analytics?.assignments_count ?? 0}</p></Card>
      </div>
      <Card>
        <SectionTitle action={<Badge tone="brand">Subjects</Badge>}>Subject Performance</SectionTitle>
        <div className="space-y-3">
          {isLoading && <Skeleton className="h-14 w-full" />}
          {isError && <p className="text-sm text-danger">Failed to load class analytics.</p>}
          {(analytics?.subject_scores ?? []).map((item) => (
            <div key={item.subject} className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-semibold">{item.subject}</p>
                <p className="text-xs text-muted-foreground">{item.entries} assessment(s)</p>
              </div>
              <span className="text-lg font-bold">{item.averageScore}%</span>
            </div>
          ))}
          {!isLoading && !isError && (analytics?.subject_scores ?? []).length === 0 && <p className="text-sm text-muted-foreground">No subject insights available.</p>}
        </div>
      </Card>
    </div>
  );
}