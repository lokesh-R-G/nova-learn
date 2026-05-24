import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { useTimetable } from "@/hooks/api-hooks";

export const Route = createFileRoute("/admin/timetable")({
  head: () => ({ meta: [{ title: "Timetable — AetherLMS" }] }),
  component: AdminTimetablePage,
});

function AdminTimetablePage() {
  const { data: timetable } = useTimetable();

  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" subtitle="Synthetic schedule derived from MongoDB mappings" />
      <Card>
        <SectionTitle action={<Badge tone="brand">{timetable?.length ?? 0} slots</Badge>}>School Timetable</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Day</th><th className="px-4 py-3">Period</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Teacher</th><th className="px-4 py-3">Room</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(timetable ?? []).map((slot) => (
                <tr key={slot.timetable_id}>
                  <td className="px-4 py-3">{slot.day}</td>
                  <td className="px-4 py-3">{slot.start_time} - {slot.end_time}</td>
                  <td className="px-4 py-3">{slot.class_id}</td>
                  <td className="px-4 py-3">{slot.subject}</td>
                  <td className="px-4 py-3">{slot.teacher_name}</td>
                  <td className="px-4 py-3">{slot.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}