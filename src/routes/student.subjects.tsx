import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { resolveStudentId } from "@/lib/defaults";
import { useMarks } from "@/hooks/api-hooks";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/student/subjects")({
  head: () => ({ meta: [{ title: "Subjects — AetherLMS" }] }),
  component: StudentSubjectsPage,
});

function StudentSubjectsPage() {
  const studentId = resolveStudentId(null);
  const { data: marks, isLoading, isError } = useMarks(studentId);

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

  const trend = useMemo(() => {
    const map = new Map<string, { total: number; max: number }>();
    (marks ?? []).forEach((item) => {
      const current = map.get(item.exam) ?? { total: 0, max: 0 };
      map.set(item.exam, { total: current.total + item.marks, max: current.max + item.max_marks });
    });
    return Array.from(map.entries()).map(([exam, totals]) => ({
      exam,
      score: totals.max ? Math.round((totals.total / totals.max) * 100) : 0,
    }));
  }, [marks]);

  return (
    <div className="space-y-6">
      <PageHeader title="Subjects" subtitle={`Academic progress for ${studentId}`} />
      <SectionTitle action={<Badge tone="brand">{subjects.length} subjects</Badge>}>Subject Performance</SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isError && <p className="text-sm text-danger">Failed to load marks.</p>}
        {isLoading && Array.from({ length: 3 }).map((_, index) => (
          <Card key={`subject-skeleton-${index}`}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-8 w-20" />
          </Card>
        ))}
        {subjects.map((subject) => (
          <Card key={subject.subject}>
            <p className="text-sm font-semibold">{subject.subject}</p>
            <p className="mt-2 text-3xl font-bold">{subject.percent}%</p>
            <p className="text-xs text-muted-foreground">{subject.count} assessment(s)</p>
          </Card>
        ))}
        {!isLoading && !isError && subjects.length === 0 && <p className="text-sm text-muted-foreground">No subject marks found.</p>}
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">Trend</Badge>}>Performance Trend</SectionTitle>
        <div className="h-64">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer>
              <LineChart data={trend} margin={{ left: -20, right: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="exam" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="score" stroke="var(--brand-600)" strokeWidth={3} dot={{ r: 4, fill: "var(--brand-600)" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}