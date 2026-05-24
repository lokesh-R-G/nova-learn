import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [{ title: "Accounts - AetherLMS" }],
  }),
  component: AccountsLayout,
});

function AccountsLayout() {
  return <Outlet />;
}
