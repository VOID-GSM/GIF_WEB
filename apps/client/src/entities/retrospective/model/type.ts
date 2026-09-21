// 회고록 도메인 타입
// TODO(backend): 실제 API 스펙 확정 시 이 파일의 타입을 서버 응답에 맞춰 조정한다.

export type RetrospectiveCategory =
  | "FEATURE"
  | "IMPROVEMENT"
  | "REFACTORING"
  | "TROUBLESHOOTING"
  | "RETROSPECT"
  | "PORTFOLIO";

/** 목록 필터에서만 쓰는 "전체"를 포함한 카테고리 값 */
export type RetrospectiveCategoryFilter = RetrospectiveCategory | "ALL";

export type RetrospectiveVisibility = "PUBLIC" | "PRIVATE";

export type RetrospectiveSort = "LATEST" | "OLDEST";

export type RelatedWorkType = "ISSUE" | "PR";

export interface RelatedWork {
  id: number;
  type: RelatedWorkType;
  /** 이슈·PR 번호 (#12 의 12) */
  number: number;
  title: string;
  /** GitHub 이슈·PR 링크 (링크로 추가한 경우) */
  url?: string;
}

/** GET /api/retrospective — 회고록 목록 */
export interface ListRetrospectiveResponse {
  id: number;
  projectId?: number;
  title: string;
  summary: string;
  category: RetrospectiveCategory;
  visibility: RetrospectiveVisibility;
  grade: number;
  classNumber: number;
  teamNumber: number;
  teamName?: string;
  part: string;
  tags?: string[];
  authorName: string;
  bookmarkCount: number;
  isBookmarked: boolean;
  createdAt: string;
}

/** GET /api/retrospective/{id} — 회고록 상세 */
export interface DetailRetrospectiveResponse extends ListRetrospectiveResponse {
  content: string;
  relatedWorks: RelatedWork[];
  isDraft: boolean;
}

/** 목록 조회 쿼리 파라미터 */
export interface RetrospectiveQueryParams {
  category?: RetrospectiveCategoryFilter;
  keyword?: string;
  sort?: RetrospectiveSort;
  /** true면 내가 북마크한 회고록만 조회한다 */
  bookmarkedOnly?: boolean;
}

/** POST·PATCH /api/retrospective — 회고록 작성·수정 */
export interface UpsertRetrospectiveRequest {
  /** 지정 시 수정, 미지정 시 신규 작성 */
  id?: number;
  title: string;
  content: string;
  authorName?: string;
  category: RetrospectiveCategory;
  visibility: RetrospectiveVisibility;
  tags: string[];
  relatedWorks: RelatedWork[];
}

export interface RetrospectivePageResponse {
  content: ListRetrospectiveResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
