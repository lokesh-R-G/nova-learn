import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { useStudents } from "@/hooks/api-hooks";

export const Route = createFileRoute("/admin/students")({
  head: () => ({ meta: [{ title: "Student Directory — AetherLMS" }] }),
  component: AdminStudentsPage,
});

function AdminStudentsPage() {
  const [q, setQ] = useState("");
  const { data: students } = useStudents();
  const filtered = (students ?? []).filter((student) =>
    [student.student_id, student.name, student.class_id].some((value) => value.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Student Directory" subtitle="Search seeded students" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search student..." className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm" />
      <SectionTitle action={<Badge tone="brand">{filtered.length} records</Badge>}>Students</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((student) => (
          <Card key={student.student_id}>
            <p className="text-sm font-semibold">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.student_id}</p>
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Class {student.class_id}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}