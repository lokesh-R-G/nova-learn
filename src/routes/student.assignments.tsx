import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { resolveStudentId } from "@/lib/defaults";
import { useStudentAssignments } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/student/assignments")({
  head: () => ({ meta: [{ title: "Assignments — AetherLMS" }] }),
  component: StudentAssignmentsPage,
});

function StudentAssignmentsPage() {
  const studentId = resolveStudentId(null);
  const { data: assignments, isLoading, isError } = useStudentAssignments(studentId);

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" subtitle={`Student ${studentId}`} />
      <Card>
        <SectionTitle action={<Badge tone="brand">{assignments?.length ?? 0} items</Badge>}>Upcoming Work</SectionTitle>
        <div className="grid gap-3 md:grid-cols-2">
          {isLoading && Array.from({ length: 4 }).map((_, index) => (
            <div key={`assignment-skeleton-${index}`} className="rounded-xl border border-border p-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-3 w-28" />
            </div>
          ))}
          {isError && <p className="text-sm text-danger">Failed to load assignments.</p>}
          {(assignments ?? []).map((assignment) => (
            <div key={assignment.assignment_id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">{assignment.subject} • Due {new Date(assignment.due_date).toLocaleDateString()}</p>
                </div>
                <Badge tone={assignment.status === "submitted" ? "success" : "warning"}>{assignment.status}</Badge>
              </div>
            </div>
          ))}
          {!isLoading && !isError && (assignments ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No assignments found for this class.</p>
          )}
        </div>
      </Card>
    </div>
  );
}