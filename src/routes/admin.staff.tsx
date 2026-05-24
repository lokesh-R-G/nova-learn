import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { useTeachers } from "@/hooks/api-hooks";

export const Route = createFileRoute("/admin/staff")({
  head: () => ({ meta: [{ title: "Academic Staff — AetherLMS" }] }),
  component: AdminStaffPage,
});

function AdminStaffPage() {
  const { data: teachers } = useTeachers();

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Staff" subtitle="Teacher directory from MongoDB" />
      <SectionTitle action={<Badge tone="brand">{teachers?.length ?? 0} staff</Badge>}>Staff Directory</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(teachers ?? []).map((teacher) => (
          <Card key={teacher.teacher_id}>
            <p className="text-sm font-semibold">{teacher.name}</p>
            <p className="text-xs text-muted-foreground">{teacher.teacher_id}</p>
            <Badge tone="neutral" className="mt-3">{teacher.subject}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}