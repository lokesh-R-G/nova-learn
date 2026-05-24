import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, SectionTitle, Badge } from "@/components/app/ui-bits";
import { resolveParentStudentId } from "@/lib/defaults";
import { useNotifications } from "@/hooks/api-hooks";

export const Route = createFileRoute("/parent/notifications")({
  head: () => ({ meta: [{ title: "Parent Notifications — AetherLMS" }] }),
  component: ParentNotificationsPage,
});

function ParentNotificationsPage() {
  const studentId = resolveParentStudentId(null);
  const { data: notifications } = useNotifications(studentId);

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle={`Alerts for ${studentId}`} />
      <SectionTitle action={<Badge tone="brand">{notifications?.length ?? 0} alerts</Badge>}>Latest Alerts</SectionTitle>
      <div className="space-y-3">
        {(notifications ?? []).map((notification) => (
          <Card key={notification.notification_id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
              <Badge tone={notification.severity}>{notification.type}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}