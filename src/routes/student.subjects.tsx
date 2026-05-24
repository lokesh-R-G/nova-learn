import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { resolveStudentId } from "@/lib/defaults";
import { useMarks } from "@/hooks/api-hooks";

export const Route = createFileRoute("/student/subjects")({
  head: () => ({ meta: [{ title: "Subjects — AetherLMS" }] }),
  component: StudentSubjectsPage,
});

function StudentSubjectsPage() {
  const studentId = resolveStudentId(null);
  const { data: marks } = useMarks(studentId);

  const subjects = useMemo(() => {
    const map = new Map<string, { total: number; max: number; count: number }>();
    (marks ?? []).forEach((mark) => {
      const current = map.get(mark.subject) ?? { total: 0, max: 0, count: 0 };
      map.set(mark.subject, {
        total: current.total + mark.marks,
        max: current.max + mark.max_marks,
        count: current.count + 1,
      });
    });
    return Array.from(map.entries()).map(([subject, totals]) => ({
      subject,
      percent: totals.max ? Math.round((totals.total / totals.max) * 100) : 0,
      count: totals.count,
    }));
  }, [marks]);

  return (
    <div className="space-y-6">
      <PageHeader title="Subjects" subtitle={`Academic progress for ${studentId}`} />
      <SectionTitle action={<Badge tone="brand">{subjects.length} subjects</Badge>}>Subject Performance</SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.subject}>
            <p className="text-sm font-semibold">{subject.subject}</p>
            <p className="mt-2 text-3xl font-bold">{subject.percent}%</p>
            <p className="text-xs text-muted-foreground">{subject.count} assessment(s)</p>
          </Card>
        ))}
        {subjects.length === 0 && <p className="text-sm text-muted-foreground">No subject marks found.</p>}
      </div>
    </div>
  );
}