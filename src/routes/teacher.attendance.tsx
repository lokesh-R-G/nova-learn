import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { resolveTeacherClassId } from "@/lib/defaults";
import { useClassAttendance, useCreateAttendance, useStudentsByClass } from "@/hooks/api-hooks";

export const Route = createFileRoute("/teacher/attendance")({
  head: () => ({ meta: [{ title: "Teacher Attendance — AetherLMS" }] }),
  component: TeacherAttendancePage,
});

function TeacherAttendancePage() {
  const classId = resolveTeacherClassId();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [statusMap, setStatusMap] = useState<Record<string, "present" | "absent">>({});
  const { data: attendance, isLoading } = useClassAttendance(classId);
  const { data: students } = useStudentsByClass(classId);
  const markMutation = useCreateAttendance();

  const todaysRows = useMemo(() => {
    return (students ?? []).map((student) => ({
      student_id: student.student_id,
      name: student.name,
      status: statusMap[student.student_id] ?? "present",
    }));
  }, [statusMap, students]);

  const submitAttendance = () => {
    todaysRows.forEach((row) => {
      markMutation.mutate({ student_id: row.student_id, class_id: classId, date, status: row.status });
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Class Attendance" subtitle={`Live class log for ${classId}`} />
      <Card>
        <SectionTitle action={<Badge tone="brand">Mark Attendance</Badge>}>Today</SectionTitle>
        <div className="mb-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl border border-border bg-card px-4 py-2 text-sm" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {todaysRows.map((row) => (
            <div key={row.student_id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <span>{row.name}</span>
              <select
                value={row.status}
                onChange={(e) => setStatusMap((prev) => ({ ...prev, [row.student_id]: e.target.value as "present" | "absent" }))}
                className="rounded-lg border border-border bg-card px-3 py-1"
              >
                <option value="present">present</option>
                <option value="absent">absent</option>
              </select>
            </div>
          ))}
        </div>
        <button type="button" onClick={submitAttendance} disabled={markMutation.isPending} className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-brand-foreground">
          {markMutation.isPending ? "Saving..." : "Save Attendance"}
        </button>
      </Card>
      <SectionTitle action={<Badge tone="brand">{attendance?.length ?? 0} records</Badge>}>Attendance Log</SectionTitle>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr><td className="px-4 py-3 text-muted-foreground" colSpan={3}>Loading attendance...</td></tr>
              )}
              {!isLoading && (attendance ?? []).length === 0 && (
                <tr><td className="px-4 py-3 text-muted-foreground" colSpan={3}>No attendance records found.</td></tr>
              )}
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