import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { resolveTeacherClassId } from "@/lib/defaults";
import { useClassAttendance } from "@/hooks/api-hooks";

export const Route = createFileRoute("/teacher/attendance")({
  head: () => ({ meta: [{ title: "Teacher Attendance — AetherLMS" }] }),
  component: TeacherAttendancePage,
});

function TeacherAttendancePage() {
  const classId = resolveTeacherClassId();
  const { data: attendance } = useClassAttendance(classId);

  return (
    <div className="space-y-6">
      <PageHeader title="Class Attendance" subtitle={`Live class log for ${classId}`} />
      <SectionTitle action={<Badge tone="brand">{attendance?.length ?? 0} records</Badge>}>Attendance Log</SectionTitle>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(attendance ?? []).map((record) => (
                <tr key={`${record.student_id}-${record.date}`}>
                  <td className="px-4 py-3">{record.student_id}</td>
                  <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}