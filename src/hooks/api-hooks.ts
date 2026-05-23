import { useMutation, useQuery, useQueryClient, useQueries } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api-client";

export type Student = { student_id: string; class_id: string; name: string };
export type Teacher = { teacher_id: string; name: string; subject: string };
export type Attendance = { student_id: string; class_id: string; date: string; status: string };
export type Marks = { student_id: string; subject: string; exam: string; marks: number; max_marks: number };
export type Assignment = { assignment_id: string; class_id: string; subject: string; title: string };
export type Fees = { student_id: string; total_fee: number; paid: number; balance: number };
export type Payment = { student_id: string; amount: number; method: string; date: string };

type ApiList<T> = { data: T[] };
type ApiItem<T> = { data: T };

type AIPayload = { student_id: string; subject: string; question: string };
type AIResponse = { answer: string; sources?: { id: string; title: string }[] };

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => apiGet<ApiList<Student>>("/students"),
    select: (data) => data.data,
  });
}

export function useStudent(id: string | undefined) {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => apiGet<ApiItem<Student>>(`/students/${id}`),
    select: (data) => data.data,
    enabled: !!id,
  });
}

export function useStudentsByClass(classId: string | undefined) {
  return useQuery({
    queryKey: ["students", "class", classId],
    queryFn: () => apiGet<ApiList<Student>>(`/students/class/${classId}`),
    select: (data) => data.data,
    enabled: !!classId,
  });
}

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: () => apiGet<ApiList<Teacher>>("/teachers"),
    select: (data) => data.data,
  });
}

export function useAttendance(studentId: string | undefined) {
  return useQuery({
    queryKey: ["attendance", studentId],
    queryFn: () => apiGet<ApiList<Attendance>>(`/attendance/${studentId}`),
    select: (data) => data.data,
    enabled: !!studentId,
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Attendance) => apiPost<ApiItem<Attendance>>("/attendance", payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendance", variables.student_id] });
    },
  });
}

export function useMarks(studentId: string | undefined) {
  return useQuery({
    queryKey: ["marks", studentId],
    queryFn: () => apiGet<ApiList<Marks>>(`/marks/${studentId}`),
    select: (data) => data.data,
    enabled: !!studentId,
  });
}

export function useCreateMarks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Marks) => apiPost<ApiItem<Marks>>("/marks", payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["marks", variables.student_id] });
    },
  });
}

export function useAssignments(classId: string | undefined) {
  return useQuery({
    queryKey: ["assignments", classId],
    queryFn: () => apiGet<ApiList<Assignment>>(`/assignments/${classId}`),
    select: (data) => data.data,
    enabled: !!classId,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Assignment) => apiPost<ApiItem<Assignment>>("/assignments", payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assignments", variables.class_id] });
    },
  });
}

export function useFees(studentId: string | undefined) {
  return useQuery({
    queryKey: ["fees", studentId],
    queryFn: () => apiGet<ApiItem<Fees>>(`/fees/${studentId}`),
    select: (data) => data.data,
    enabled: !!studentId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Payment) => apiPost<ApiItem<Payment>>("/payments", payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fees", variables.student_id] });
    },
  });
}

export function useAIChat() {
  return useMutation({
    mutationFn: (payload: AIPayload) => apiPost<AIResponse>("/ai/chat", payload),
  });
}

export function useFeesQueries(studentIds: string[]) {
  return useQueries({
    queries: studentIds.map((studentId) => ({
      queryKey: ["fees", studentId],
      queryFn: () => apiGet<ApiItem<Fees>>(`/fees/${studentId}`),
      select: (data: ApiItem<Fees>) => data.data,
      enabled: !!studentId,
    })),
  });
}
