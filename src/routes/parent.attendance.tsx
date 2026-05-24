import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { resolveParentStudentId } from "@/lib/defaults";
import { useAttendance } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/parent/attendance")({
  head: () => ({ meta: [{ title: "Parent Attendance — AetherLMS" }] }),
  component: ParentAttendancePage,
});

function ParentAttendancePage() {
  const studentId = resolveParentStudentId(null);
  const { data: attendance, isLoading, isError } = useAttendance(studentId);

  const stats = useMemo(() => {
    const total = attendance?.length ?? 0;
    const present = attendance?.filter((record) => record.status === "present").length ?? 0;
    return { total, present, percent: total ? Math.round((present / total) * 100) : 0 };
  }, [attendance]);

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" subtitle={`Child record for ${studentId}`} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card><p className="text-xs uppercase text-muted-foreground">Total</p><p className="mt-2 text-2xl font-bold">{stats.total}</p></Card>
        <Card><p className="text-xs uppercase text-muted-foreground">Present</p><p className="mt-2 text-2xl font-bold">{stats.present}</p></Card>
        <Card><p className="text-xs uppercase text-muted-foreground">Rate</p><p className="mt-2 text-2xl font-bold">{stats.percent}%</p></Card>
        <Card><p className="text-xs uppercase text-muted-foreground">Notes</p><p className="mt-2 text-2xl font-bold">Live</p></Card>
      </div>
      <Card>
        <SectionTitle action={<Badge tone="brand">Latest records</Badge>}>Session Log</SectionTitle>
        <div className="space-y-2">
          {isLoading && <Skeleton className="h-12 w-full" />}
          {isError && <p className="text-sm text-danger">Failed to load attendance.</p>}
          {(attendance ?? []).slice(0, 6).map((record) => (
            <div key={`${record.student_id}-${record.date}`} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <span>{new Date(record.date).toLocaleDateString()}</span>
              <Badge tone={record.status === "present" ? "success" : "danger"}>{record.status}</Badge>
            </div>
          ))}
          {!isLoading && !isError && (attendance ?? []).length === 0 && <p className="text-sm text-muted-foreground">No attendance found.</p>}
        </div>
      </Card>
    </div>
  );
}