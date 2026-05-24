import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [{ title: "Student - AetherLMS" }],
  }),
  component: StudentLayout,
});

function StudentLayout() {
  return <Outlet />;
}
