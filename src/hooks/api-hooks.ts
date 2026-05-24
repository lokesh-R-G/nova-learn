import { useMutation, useQuery, useQueryClient, useQueries } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api-client";

export type Student = { student_id: string; class_id: string; name: string };
export type Teacher = { teacher_id: string; name: string; subject: string };
export type Attendance = { student_id: string; class_id: string; date: string; status: string };
export type Marks = { student_id: string; subject: string; exam: string; marks: number; max_marks: number };
export type Assignment = { assignment_id: string; class_id: string; subject: string; title: string };
export type AssignmentInput = { class_id: string; subject: string; title: string };
export type StudentAssignment = Assignment & {
  due_date: string;
  status: "pending" | "submitted";
  submission_marks: number | null;
};
export type Fees = { student_id: string; total_fee: number; paid: number; balance: number };
export type Payment = { student_id: string; amount: number; method: string; date: string; transaction_id?: string };
export type PaymentRecord = { student_id: string; amount: number; method: string; date: string; transaction_id?: string };
export type AttendanceSummary = {
  student_id: string;
  overall: { attended_sessions: number; total_sessions: number; attendance_percent: number };
  subjects: {
    subject: string;
    attended_sessions: number;
    total_sessions: number;
    attendance_percent: number;
  }[];
};
export type TimetableEntry = {
  timetable_id: string;
  day: string;
  period: number;
  start_time: string;
  end_time: string;
  class_id: string;
  grade: number | null;
  section: string | null;
  subject: string;
  teacher_id: string;
  teacher_name: string;
  room: string;
  status: string;
};
export type NotificationItem = {
  notification_id: string;
  type: string;
  title: string;
  message: string;
  severity: "danger" | "warning" | "success" | "brand";
  date: string;
  read: boolean;
};
export type ClassAnalytics = {
  class_id: string;
  student_count: number;
  attendance_rate: number;
  average_score: number;
  assignments_count: number;
  teacher_assignments: number;
  subject_scores: { subject: string; averageScore: number; entries: number }[];
};

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

export function useClassAttendance(classId: string | undefined) {
  return useQuery({
    queryKey: ["attendance", "class", classId],
    queryFn: () => apiGet<ApiList<Attendance>>(`/attendance/class/${classId}`),
    select: (data) => data.data,
    enabled: !!classId,
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

export function useAttendanceSummary(studentId: string | undefined) {
  return useQuery({
    queryKey: ["attendance", "summary", studentId],
    queryFn: () => apiGet<ApiItem<AttendanceSummary>>(`/attendance/student/${studentId}/summary`),
    select: (data) => data.data,
    enabled: !!studentId,
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
    mutationFn: (payload: AssignmentInput) => apiPost<ApiItem<Assignment>>("/assignments", payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assignments", variables.class_id] });
    },
  });
}

export function useStudentAssignments(studentId: string | undefined) {
  return useQuery({
    queryKey: ["assignments", "student", studentId],
    queryFn: () => apiGet<ApiList<StudentAssignment>>(`/assignments/student/${studentId}`),
    select: (data) => data.data,
    enabled: !!studentId,
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

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => apiGet<ApiList<PaymentRecord>>("/payments"),
    select: (data) => data.data,
  });
}

export function useTimetable() {
  return useQuery({
    queryKey: ["timetable"],
    queryFn: () => apiGet<ApiList<TimetableEntry>>("/timetable"),
    select: (data) => data.data,
  });
}

export function useCreateTimetable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TimetableEntry) => apiPost<ApiItem<TimetableEntry>>("/timetable", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
    },
  });
}

export function useNotifications(studentId: string | undefined) {
  return useQuery({
    queryKey: ["notifications", studentId],
    queryFn: () => apiGet<ApiList<NotificationItem>>(`/notifications/${studentId}`),
    select: (data) => data.data,
    enabled: !!studentId,
  });
}

export function useClassAnalytics(classId: string | undefined) {
  return useQuery({
    queryKey: ["analytics", classId],
    queryFn: () => apiGet<ApiItem<ClassAnalytics>>(`/analytics/class/${classId}`),
    select: (data) => data.data,
    enabled: !!classId,
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
