import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { resolveTeacherClassId } from "@/lib/defaults";
import { useAssignments } from "@/hooks/api-hooks";

export const Route = createFileRoute("/teacher/assignments")({
  head: () => ({ meta: [{ title: "Teacher Assignments — AetherLMS" }] }),
  component: TeacherAssignmentsPage,
});

function TeacherAssignmentsPage() {
  const classId = resolveTeacherClassId();
  const { data: assignments } = useAssignments(classId);

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments to Grade" subtitle={`Class ${classId}`} />
      <SectionTitle action={<Badge tone="brand">{assignments?.length ?? 0} items</Badge>}>Assignments</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(assignments ?? []).map((assignment) => (
          <Card key={assignment.assignment_id}>
            <p className="font-semibold">{assignment.title}</p>
            <p className="text-xs text-muted-foreground">{assignment.subject}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}