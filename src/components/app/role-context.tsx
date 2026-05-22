import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Role = "admin" | "teacher" | "student" | "parent" | "accounts";

export const ROLES: { id: Role; label: string; person: string; subtitle: string }[] = [
  { id: "admin", label: "Admin", person: "Sarah Chen", subtitle: "Principal Admin" },
  { id: "teacher", label: "Teacher", person: "Mr. Daniel Lee", subtitle: "Physics, Grade 12" },
  { id: "student", label: "Student", person: "Aria Patel", subtitle: "Grade 11-A" },
  { id: "parent", label: "Parent", person: "Mrs. Patel", subtitle: "Parent of Aria" },
  { id: "accounts", label: "Accounts", person: "Jonas Müller", subtitle: "Finance Officer" },
];

type Ctx = { role: Role; setRole: (r: Role) => void; current: (typeof ROLES)[number] };
const RoleCtx = createContext<Ctx | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  const value = useMemo<Ctx>(
    () => ({ role, setRole, current: ROLES.find((r) => r.id === role)! }),
    [role],
  );
  return <RoleCtx.Provider value={value}>{children}</RoleCtx.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleCtx);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}
