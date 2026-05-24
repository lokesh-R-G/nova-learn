import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { resolveStudentId } from "@/lib/defaults";
import { useAssignments, useStudent } from "@/hooks/api-hooks";

export const Route = createFileRoute("/student/assignments")({
  head: () => ({ meta: [{ title: "Assignments — AetherLMS" }] }),
  component: StudentAssignmentsPage,
});

function StudentAssignmentsPage() {
  const studentId = resolveStudentId(null);
  const { data: student } = useStudent(studentId);
  const { data: assignments } = useAssignments(student?.class_id);

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" subtitle={`Class ${student?.class_id ?? "—"}`} />
      <Card>
        <SectionTitle action={<Badge tone="brand">{assignments?.length ?? 0} items</Badge>}>Upcoming Work</SectionTitle>
        <div className="grid gap-3 md:grid-cols-2">
          {(assignments ?? []).map((assignment, index) => (
            <div key={assignment.assignment_id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">{assignment.subject} • {assignment.class_id}</p>
                </div>
                <Badge tone={index === 0 ? "danger" : "neutral"}>Due soon</Badge>
              </div>
            </div>
          ))}
          {(assignments ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No assignments found for this class.</p>
          )}
        </div>
      </Card>
    </div>
  );
}