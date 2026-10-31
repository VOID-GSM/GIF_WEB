import { apiClient } from "@repo/lib";

import type {
  DetailRetrospectiveResponse,
  ListRetrospectiveResponse,
  RelatedWork,
  RetrospectiveCategory,
  RetrospectivePageResponse,
  RetrospectiveQueryParams,
  RetrospectiveVisibility,
  UpsertRetrospectiveRequest,
} from "../model/type";

type ServerCategory =
  | "FEATURE_DEV"
  | "FEATURE_IMPROVEMENT"
  | "REFACTORING"
  | "TROUBLESHOOTING"
  | "RETROSPECTIVE"
  | "PORTFOLIO";

interface ServerRetrospectiveBase {
  id: number;
  title: string;
  summary: string;
  category: ServerCategory;
  visibility: RetrospectiveVisibility;
  grade: number;
  classNo: number;
  teamNo: number;
  part: string;
  bookmarkCount: number;
  isBookmarked: boolean;
  isMine?: boolean;
  authorName: string;
  createdAt: string;
}

type ServerListRetrospectiveResponse = ServerRetrospectiveBase;

interface ServerDetailRetrospectiveResponse extends ServerRetrospectiveBase {
  content: string;
  relatedWorks?: ServerRelatedWork[] | null;
  isDraft: boolean;
  isMine: boolean;
}

interface ServerRelatedWork extends Omit<RelatedWork, "id" | "url"> {
  id?: number;
  url?: string;
  link?: string;
  githubUrl?: string;
}

interface ServerBookmarkToggleResponse {
  bookmarkCount: number;
  isBookmarked: boolean;
}

const categoryToServer: Record<RetrospectiveCategory, ServerCategory> = {
  FEATURE: "FEATURE_DEV",
  IMPROVEMENT: "FEATURE_IMPROVEMENT",
  REFACTORING: "REFACTORING",
  TROUBLESHOOTING: "TROUBLESHOOTING",
  RETROSPECT: "RETROSPECTIVE",
  PORTFOLIO: "PORTFOLIO",
};

const categoryFromServer: Record<ServerCategory, RetrospectiveCategory> = {
  FEATURE_DEV: "FEATURE",
  FEATURE_IMPROVEMENT: "IMPROVEMENT",
  REFACTORING: "REFACTORING",
  TROUBLESHOOTING: "TROUBLESHOOTING",
  RETROSPECTIVE: "RETROSPECT",
  PORTFOLIO: "PORTFOLIO",
};

function mapListResponse(
  response: ServerListRetrospectiveResponse,
): ListRetrospectiveResponse {
  return {
    id: response.id,
    title: response.title,
    summary: response.summary,
    category: categoryFromServer[response.category],
    visibility: response.visibility,
    grade: response.grade,
    classNumber: response.classNo,
    teamNumber: response.teamNo,
    part: response.part,
    bookmarkCount: response.bookmarkCount,
    isBookmarked: response.isBookmarked,
    isMine: response.isMine ?? false,
    authorName: response.authorName,
    createdAt: response.createdAt,
  };
}

function mapDetailResponse(
  response: ServerDetailRetrospectiveResponse,
): DetailRetrospectiveResponse {
  return {
    ...mapListResponse(response),
    content: response.content,
    relatedWorks: (response.relatedWorks ?? []).map((work, index) => ({
      id: work.id ?? index,
      type: work.type,
      number: work.number,
      title: work.title,
      url: work.url ?? work.link ?? work.githubUrl,
    })),
    isDraft: response.isDraft,
  };
}

function toServerBody(payload: UpsertRetrospectiveRequest) {
  return {
    category: categoryToServer[payload.category],
    visibility: payload.visibility,
    title: payload.title,
    content: payload.content,
    relatedWorks: payload.relatedWorks.map(({ type, number, title, url }) => ({
      type,
      number,
      title,
      url,
    })),
  };
}

export async function getRetrospectives(
  params: RetrospectiveQueryParams = {},
): Promise<RetrospectivePageResponse> {
  const { data } = await apiClient.get<{
    content: ServerListRetrospectiveResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  }>("/api/retrospective", {
    params: {
      category:
        params.category && params.category !== "ALL"
          ? categoryToServer[params.category]
          : undefined,
      keyword: params.keyword?.trim() || undefined,
      sort: params.sort,
      page: 0,
      size: 100,
    },
  });

  return { ...data, content: data.content.map(mapListResponse) };
}

export async function getRetrospectiveDetail(
  id: number,
): Promise<DetailRetrospectiveResponse> {
  const { data } = await apiClient.get<ServerDetailRetrospectiveResponse>(
    `/api/retrospective/${id}`,
  );
  return mapDetailResponse(data);
}

export async function createRetrospective(
  payload: UpsertRetrospectiveRequest,
): Promise<number> {
  const { data } = await apiClient.post<number>(
    "/api/retrospective",
    toServerBody(payload),
  );
  return data;
}

export async function updateRetrospective(
  id: number,
  payload: UpsertRetrospectiveRequest,
): Promise<void> {
  await apiClient.patch(`/api/retrospective/${id}`, toServerBody(payload));
}

export async function getDraftRetrospectives(): Promise<
  DetailRetrospectiveResponse[]
> {
  const { data } = await apiClient.get<ServerListRetrospectiveResponse[]>(
    "/api/retrospective/draft",
  );
  return data.map((item) => ({
    ...mapListResponse(item),
    content: "",
    relatedWorks: [],
    isDraft: true,
  }));
}

export async function createDraftRetrospective(
  payload: UpsertRetrospectiveRequest,
): Promise<number> {
  const { data } = await apiClient.post<number>(
    "/api/retrospective/draft",
    toServerBody(payload),
  );
  return data;
}

export async function updateDraftRetrospective(
  id: number,
  payload: UpsertRetrospectiveRequest,
): Promise<void> {
  await apiClient.patch(
    `/api/retrospective/draft/${id}`,
    toServerBody(payload),
  );
}

export async function deleteRetrospective(id: number): Promise<void> {
  await apiClient.delete(`/api/retrospective/${id}`);
}

export async function deleteDraftRetrospective(id: number): Promise<void> {
  await apiClient.delete(`/api/retrospective/draft/${id}`);
}

export async function toggleRetrospectiveBookmark(
  id: number,
): Promise<ServerBookmarkToggleResponse> {
  const { data } = await apiClient.post<ServerBookmarkToggleResponse>(
    `/api/retrospective/${id}/bookmark`,
  );
  return data;
}
