import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveStudentId } from "@/lib/defaults";
import { useAttendance, useAttendanceSummary } from "@/hooks/api-hooks";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/student/attendance")({
  head: () => ({ meta: [{ title: "Attendance — AetherLMS" }] }),
  component: StudentAttendancePage,
});

function StudentAttendancePage() {
  const studentId = resolveStudentId(null);
  const { data: attendance, isLoading, isError } = useAttendance(studentId);
  const { data: summary, isLoading: summaryLoading } = useAttendanceSummary(studentId);

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
        <SectionTitle action={<Badge tone="brand">Subject-wise</Badge>}>Attendance by Subject</SectionTitle>
        <div className="h-72">
          {summaryLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer>
              <BarChart data={summary?.subjects ?? []} margin={{ left: -20, right: 10 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  formatter={(value, key, row) => {
                    const payload = row?.payload;
                    if (!payload) return value;
                    return [`${payload.attended_sessions}/${payload.total_sessions}`, "Sessions"];
                  }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}
                />
                <Bar dataKey="attendance_percent" fill="var(--brand-500)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

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
              {isError && (
                <tr><td className="px-4 py-4 text-danger" colSpan={3}>Failed to load attendance.</td></tr>
              )}
              {!isLoading && !isError && (attendance ?? []).length === 0 && (
                <tr><td className="px-4 py-4 text-muted-foreground" colSpan={3}>No attendance records found.</td></tr>
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