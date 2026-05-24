import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { resolveTeacherClassId } from "@/lib/defaults";
import { useAssignments, useCreateAssignment } from "@/hooks/api-hooks";

export const Route = createFileRoute("/teacher/assignments")({
  head: () => ({ meta: [{ title: "Teacher Assignments — AetherLMS" }] }),
  component: TeacherAssignmentsPage,
});

function TeacherAssignmentsPage() {
  const classId = resolveTeacherClassId();
  const { data: assignments, isLoading } = useAssignments(classId);
  const createMutation = useCreateAssignment();
  const [form, setForm] = useState({ class_id: classId, subject: "", title: "" });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate(form);
    setForm((prev) => ({ ...prev, subject: "", title: "" }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments to Grade" subtitle={`Class ${classId}`} />
      <Card>
        <SectionTitle action={<Badge tone="brand">Create</Badge>}>Create Assignment</SectionTitle>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
          <input value={form.class_id} onChange={(e) => setForm((prev) => ({ ...prev, class_id: e.target.value }))} className="rounded-xl border border-border bg-card px-4 py-2 text-sm" placeholder="Class" required />
          <input value={form.subject} onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} className="rounded-xl border border-border bg-card px-4 py-2 text-sm" placeholder="Subject" required />
          <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} className="rounded-xl border border-border bg-card px-4 py-2 text-sm" placeholder="Title" required />
          <button type="submit" disabled={createMutation.isPending} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-brand-foreground md:col-span-3">
            {createMutation.isPending ? "Saving..." : "Create Assignment"}
          </button>
        </form>
      </Card>
      <SectionTitle action={<Badge tone="brand">{assignments?.length ?? 0} items</Badge>}>Assignments</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading assignments...</p>}
        {!isLoading && (assignments ?? []).length === 0 && <p className="text-sm text-muted-foreground">No assignments found.</p>}
        {(assignments ?? []).map((assignment) => (
          <Card key={assignment.assignment_id}>
            <p className="font-semibold">{assignment.title}</p>
            <p className="text-xs text-muted-foreground">{assignment.subject}</p>
            <p className="mt-2 text-xs text-muted-foreground">Submissions: {(assignment as any).submission_count ?? 0}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}