export type AdminRole =
  | "MAJOR_TEACHER"
  | "GENERAL_TEACHER"
  | "MASTER"
  | "VOID";

export type AssignmentStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface AssignmentInfo {
  status: AssignmentStatus;
  rejectReason?: string;
}

export interface UnsubmittedProjectInfo {
  projectId: number;
  projectName: string;
  teamName: string;
}

export interface TeacherListResponse {
  id: number;
  email: string;
  name: string;
  adminRole: AdminRole;
  adminTeam: string;
  isGradeHead: boolean;
  assignmentInfo?: AssignmentInfo;
  isScoreSubmitted: boolean;
  unsubmittedProjects: UnsubmittedProjectInfo[];
}

export interface AssignProjectTeacherRequest {
  projectId: number;
  teacherId: number;
}

export interface RespondAssignmentRequest {
  status: AssignmentStatus;
  rejectReason?: string;
}
