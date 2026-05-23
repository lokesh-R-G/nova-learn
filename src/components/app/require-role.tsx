import { useState } from "react";
import { Card, PrimaryButton, SecondaryButton } from "./ui-bits";
import { useAuth } from "@/hooks/use-auth";
import { LoginCard } from "./login-card";

type Props = {
  roles: string[];
  children: React.ReactNode;
};

export function RequireRole({ roles, children }: Props) {
  const { auth, logout } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!auth) {
    return (
      <div className="mx-auto w-full max-w-xl">
        <LoginCard />
      </div>
    );
  }

  if (!roles.includes(auth.role)) {
    if (dismissed) return null;
    return (
      <Card className="mx-auto max-w-xl">
        <h2 className="text-lg font-bold">Access restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account role ({auth.role}) does not have access to this section.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <SecondaryButton onClick={logout}>Sign out</SecondaryButton>
          <PrimaryButton onClick={() => setDismissed(true)}>Dismiss</PrimaryButton>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}
