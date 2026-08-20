import { apiClient } from "@repo/lib";

import type {
  AssignProjectTeacherRequest,
  RespondAssignmentRequest,
  TeacherListResponse,
} from "@/entities/teacher/model/type";

export const getAllTeachers = async (): Promise<TeacherListResponse[]> => {
  const { data } = await apiClient.get<TeacherListResponse[]>(
    "/api/admin/teachers",
  );
  return data;
};

export const assignTeacher = async (
  body: AssignProjectTeacherRequest,
): Promise<void> => {
  await apiClient.post<void>("/api/admin/teachers/assign", body);
};

export const respondAssignment = async (
  assignmentId: number,
  body: RespondAssignmentRequest,
): Promise<void> => {
  await apiClient.patch<void>(
    `/api/teachers/assignments/${assignmentId}`,
    body,
  );
};
