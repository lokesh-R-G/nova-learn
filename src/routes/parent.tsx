import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/parent")({
  head: () => ({
    meta: [{ title: "Parent - AetherLMS" }],
  }),
  component: ParentLayout,
});

function ParentLayout() {
  return <Outlet />;
}
