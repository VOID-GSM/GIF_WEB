import type { Locale } from "@repo/i18n";
import { apiClient } from "@repo/lib";

import type { RawEngagement } from "../model/engagement";
import type {
  CreateProjectRequest,
  ProjectDetail,
  ProjectDetailResponse,
  ProjectResponse,
  ProjectSummaryResponse,
  UpdateProjectRequest,
  UserSearchResult,
} from "../model/types";

export const createProject = async (
  data: CreateProjectRequest,
): Promise<number> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("teamName", data.teamName);
  formData.append("description", data.description);
  formData.append("grade", String(data.grade));
  data.memberIds.forEach((id) => formData.append("memberIds", String(id)));
  if (data.logo) formData.append("logo", data.logo);

  const { data: responseData } = await apiClient.post<number>(
    "/api/project",
    formData,
    { headers: { "Content-Type": null } },
  );

  return responseData;
};

export const getMyProject = async (): Promise<ProjectResponse> => {
  const { data } = await apiClient.get<ProjectResponse>("/api/project/me");
  return data;
};

// 교내 사용자 전용 화면(수정·대시보드)에서 쓰는 상세 — 팀원 userId·학번이 포함된다.
// 참여 지표 필드가 빠질 수 있어 원본 응답 타입으로 받는다 — 훅에서 정규화한다.
export const getProject = async (
  projectId: number,
): Promise<RawEngagement<ProjectDetail>> => {
  const { data } = await apiClient.get<RawEngagement<ProjectDetail>>(
    `/api/project/${projectId}`,
  );
  return data;
};

// 서버가 번역 시 고유명사를 지키려고 붙인 <keep> 표시가 번역문에 남아 오는 경우가 있다.
// 맨 앞의 <keep> 블록은 프로젝트명·팀명을 반복한 것이라 통째로 지우고,
// 문장 중간의 <keep> 은 태그만 지우고 안의 글자는 남긴다.
const stripKeepMarkers = (text: string) =>
  text
    .replace(/^\s*<keep>[\s\S]*?<\/keep>\s*/, "")
    .replace(/<\/?keep>/g, "");

// 공개 상세 — 비로그인·외부 사용자는 팀원 userId·학번이 빠진 응답을 받는다.
// lang=ja 면 서버가 소개(description)를 AI 일본어 번역문으로 준다 (descriptionTranslated 로 구분).
// 수정 화면은 원문이 필요하므로 getProject 에는 lang 을 넘기지 않는다.
export const getPublicProject = async (
  projectId: number,
  lang: Locale,
): Promise<RawEngagement<ProjectDetailResponse>> => {
  const { data } = await apiClient.get<RawEngagement<ProjectDetailResponse>>(
    `/api/project/${projectId}`,
    { params: { lang } },
  );
  if (!data.descriptionTranslated) return data;
  return { ...data, description: stripKeepMarkers(data.description) };
};

export const updateProject = async (
  projectId: number,
  data: UpdateProjectRequest,
): Promise<void> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("teamName", data.teamName);
  formData.append("description", data.description);
  formData.append("grade", String(data.grade));
  data.addMemberIds.forEach((id) => formData.append("addMemberIds", String(id)));
  data.removeMemberIds.forEach((id) =>
    formData.append("removeMemberIds", String(id)),
  );
  if (data.logo) formData.append("logo", data.logo);

  await apiClient.put(`/api/project/${projectId}/update`, formData, {
    headers: { "Content-Type": null },
  });
};

// 팀원(리더 아님)은 프로젝트 설명만 수정 가능 — 전체 수정(PUT)은 리더만 허용(403)
export const updateProjectDescription = async (
  projectId: number,
  description: string,
): Promise<void> => {
  await apiClient.patch(`/api/project/${projectId}/description`, {
    description,
  });
};

export const searchUsers = async (keyword: string): Promise<UserSearchResult[]> => {
  const { data } = await apiClient.get<UserSearchResult[]>("/api/project/users/search", {
    params: { keyword },
  });
  return data;
};

export const getProjectSummary = async (
  projectId: number,
): Promise<ProjectSummaryResponse> => {
  const { data } = await apiClient.get<ProjectSummaryResponse>(
    `/api/project/${projectId}/summary`,
  );
  return data;
};
