import { useState } from "react";
import { Card, PrimaryButton, SecondaryButton } from "./ui-bits";
import { login } from "@/lib/auth";

type Props = {
  onSuccess?: () => void;
};

const ROLES = ["admin", "teacher", "student", "parent", "accounts"] as const;

type Role = (typeof ROLES)[number];

export function LoginCard({ onSuccess }: Props) {
  const [role, setRole] = useState<Role>("student");
  const [identifier, setIdentifier] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login({
        role,
        identifier: identifier.trim(),
        access_code: accessCode.trim() || undefined,
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <h2 className="text-lg font-bold">Sign in</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Use your role and identifier (e.g., ST0001 or T001). Admin/accounts require access code.
      </p>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <label className="block text-xs font-semibold text-muted-foreground" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value as Role)}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label className="block text-xs font-semibold text-muted-foreground" htmlFor="identifier">
          Identifier
        </label>
        <input
          id="identifier"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="ST0001"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
        />

        {(role === "admin" || role === "accounts") && (
          <>
            <label className="block text-xs font-semibold text-muted-foreground" htmlFor="accessCode">
              Access code
            </label>
            <input
              id="accessCode"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              placeholder="ADMIN_ACCESS_CODE"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            />
          </>
        )}

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex items-center gap-2">
          <PrimaryButton type="submit" disabled={busy || !identifier.trim()}>
            {busy ? "Signing in..." : "Sign in"}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => {
            setIdentifier("");
            setAccessCode("");
            setError(null);
          }}>
            Clear
          </SecondaryButton>
        </div>
      </form>
    </Card>
  );
}
