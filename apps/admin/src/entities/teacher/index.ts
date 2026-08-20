export { getAllTeachers, assignTeacher, respondAssignment } from "./api/teacherApi";

export { useGetAllTeachers } from "./hooks/useGetAllTeachers";
export { useAssignTeacher } from "./hooks/useAssignTeacher";
export { useRespondAssignment } from "./hooks/useRespondAssignment";

export type {
  AdminRole,
  AssignmentStatus,
  AssignmentInfo,
  UnsubmittedProjectInfo,
  TeacherListResponse,
  AssignProjectTeacherRequest,
  RespondAssignmentRequest,
} from "./model/type";
