import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { useClassAnalytics, useClassAttendance, useStudents } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/students")({
  head: () => ({ meta: [{ title: "Student Directory — AetherLMS" }] }),
  component: AdminStudentsPage,
});

function AdminStudentsPage() {
  const [q, setQ] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const { data: students, isLoading, isError } = useStudents();
  const { data: classInsights } = useClassAnalytics(selectedClass || undefined);
  const { data: classAttendance } = useClassAttendance(selectedClass || undefined);

  const classIds = useMemo(() => {
    return Array.from(new Set((students ?? []).map((student) => student.class_id))).sort();
  }, [students]);

  const filtered = (students ?? []).filter((student) =>
    [student.student_id, student.name, student.class_id].some((value) => value.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Student Directory" subtitle="Search seeded students" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search student..." className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm" />

      <Card>
        <SectionTitle action={<Badge tone="brand">Class analytics</Badge>}>Class Explorer</SectionTitle>
        <div className="grid gap-3 md:grid-cols-3">
          {classIds.map((classId) => (
            <button
              key={classId}
              type="button"
              onClick={() => setSelectedClass(classId)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition ${selectedClass === classId ? "border-brand-500 bg-brand-50" : "border-border bg-card hover:bg-secondary"}`}
            >
              <p className="font-semibold">{classId}</p>
            </button>
          ))}
        </div>
        {selectedClass && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase text-muted-foreground">Performance</p>
              <p className="mt-2 text-sm">Class: {classInsights?.class_id ?? selectedClass}</p>
              <p className="text-sm">Avg Marks: {classInsights?.class_average_marks ?? 0}%</p>
              <p className="text-sm">Top Subject: {classInsights?.top_subject ?? "-"}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase text-muted-foreground">Attendance</p>
              <p className="mt-2 text-sm">Records: {classAttendance?.length ?? 0}</p>
              <p className="text-sm">Present: {(classAttendance ?? []).filter((entry) => entry.status === "present").length}</p>
              <p className="text-sm">Absent: {(classAttendance ?? []).filter((entry) => entry.status !== "present").length}</p>
            </div>
          </div>
        )}
      </Card>

      <SectionTitle action={<Badge tone="brand">{filtered.length} records</Badge>}>Students</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isError && <p className="text-sm text-danger">Failed to load students.</p>}
        {isLoading && Array.from({ length: 6 }).map((_, index) => (
          <Card key={`student-skeleton-${index}`}>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-2 h-3 w-24" />
          </Card>
        ))}
        {filtered.map((student) => (
          <Card key={student.student_id}>
            <p className="text-sm font-semibold">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.student_id}</p>
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Class {student.class_id}</p>
          </Card>
        ))}
        {!isLoading && !isError && filtered.length === 0 && <p className="text-sm text-muted-foreground">No students found.</p>}
      </div>
    </div>
  );
}