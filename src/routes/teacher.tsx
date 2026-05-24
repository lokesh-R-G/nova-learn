import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/teacher")({
  head: () => ({
    meta: [{ title: "Teacher - AetherLMS" }],
  }),
  component: TeacherLayout,
});

function TeacherLayout() {
  return <Outlet />;
}
