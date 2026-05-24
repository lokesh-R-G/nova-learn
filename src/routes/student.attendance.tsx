import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveStudentId } from "@/lib/defaults";
import { useAttendance } from "@/hooks/api-hooks";

export const Route = createFileRoute("/student/attendance")({
  head: () => ({ meta: [{ title: "Attendance — AetherLMS" }] }),
  component: StudentAttendancePage,
});

function StudentAttendancePage() {
  const studentId = resolveStudentId(null);
  const { data: attendance, isLoading } = useAttendance(studentId);

  const stats = useMemo(() => {
    const total = attendance?.length ?? 0;
    const present = attendance?.filter((record) => record.status === "present").length ?? 0;
    return { total, present, percent: total ? Math.round((present / total) * 100) : 0 };
  }, [attendance]);

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" subtitle={`Tracking records for ${studentId}`} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card><p className="text-xs uppercase text-muted-foreground">Total</p><p className="mt-2 text-2xl font-bold">{stats.total}</p></Card>
        <Card><p className="text-xs uppercase text-muted-foreground">Present</p><p className="mt-2 text-2xl font-bold text-success">{stats.present}</p></Card>
        <Card><p className="text-xs uppercase text-muted-foreground">Rate</p><p className="mt-2 text-2xl font-bold">{stats.percent}%</p></Card>
        <Card><p className="text-xs uppercase text-muted-foreground">Status</p><p className="mt-2 text-2xl font-bold">Live</p></Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">Live data</Badge>}>Recent Sessions</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr><td className="px-4 py-4" colSpan={3}><Skeleton className="h-6 w-full" /></td></tr>
              )}
              {(attendance ?? []).map((record) => (
                <tr key={`${record.student_id}-${record.date}`}>
                  <td className="px-4 py-4">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-4 py-4">{record.class_id}</td>
                  <td className="px-4 py-4">
                    <Badge tone={record.status === "present" ? "success" : "danger"}>
                      {record.status === "present" ? <CheckCircle2 className="mr-1 inline size-3" /> : <XCircle className="mr-1 inline size-3" />}
                      {record.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}