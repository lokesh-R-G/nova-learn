import type { AuthState } from "./auth";

export const DEFAULTS = {
  studentId: "ST0001",
  parentStudentId: "ST0001",
  teacherClassId: "C1A",
  accountsSampleStudentId: "ST0001",
};

export function resolveStudentId(auth: AuthState | null) {
  if (auth?.role === "student") return auth.identifier;
  return DEFAULTS.studentId;
}

export function resolveParentStudentId(auth: AuthState | null) {
  if (auth?.role === "parent") return DEFAULTS.parentStudentId;
  return resolveStudentId(auth);
}

export function resolveTeacherClassId() {
  return DEFAULTS.teacherClassId;
}
