import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin - AetherLMS" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
