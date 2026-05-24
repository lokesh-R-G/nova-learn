import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { useCreateTimetable, useTimetable } from "@/hooks/api-hooks";

export const Route = createFileRoute("/admin/timetable")({
  head: () => ({ meta: [{ title: "Timetable — AetherLMS" }] }),
  component: AdminTimetablePage,
});

function AdminTimetablePage() {
  const { data: timetable, isLoading } = useTimetable();
  const createMutation = useCreateTimetable();
  const [form, setForm] = useState({
    timetable_id: "",
    class_id: "",
    day: "Monday",
    period: "1",
    start_time: "09:00",
    end_time: "09:45",
    subject: "",
    teacher_id: "",
    teacher_name: "",
    room: "",
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate({
      ...form,
      period: Number(form.period),
      grade: null,
      section: null,
      status: "scheduled",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" subtitle="Synthetic schedule derived from MongoDB mappings" />
      <Card>
        <SectionTitle action={<Badge tone="brand">Create Slot</Badge>}>Add Timetable Slot</SectionTitle>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          {Object.entries(form).map(([key, value]) => (
            <input
              key={key}
              value={value}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={key}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm"
              required
            />
          ))}
          <button type="submit" disabled={createMutation.isPending} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-brand-foreground md:col-span-2">
            {createMutation.isPending ? "Saving..." : "Save Slot"}
          </button>
        </form>
      </Card>
      <Card>
        <SectionTitle action={<Badge tone="brand">{timetable?.length ?? 0} slots</Badge>}>School Timetable</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Day</th><th className="px-4 py-3">Period</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Teacher</th><th className="px-4 py-3">Room</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr><td className="px-4 py-3 text-muted-foreground" colSpan={6}>Loading timetable...</td></tr>
              )}
              {!isLoading && (timetable ?? []).length === 0 && (
                <tr><td className="px-4 py-3 text-muted-foreground" colSpan={6}>No timetable entries found.</td></tr>
              )}
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