// TODO(backend): 실제 API 연동 시 이 모듈 전체를 삭제하고 훅 내부를 TanStack Query로 교체한다.
// 세션 동안 작성·임시 저장한 회고록이 목록 화면에도 보이도록,
// 목 데이터를 모듈 레벨 스토어에 담고 useSyncExternalStore로 구독한다.

import { MOCK_DRAFT_RETROSPECTIVES } from "./mockDrafts";
import { MOCK_RETROSPECTIVES } from "./mockRetrospectives";
import type {
  DetailRetrospectiveResponse,
  UpsertRetrospectiveRequest,
} from "./type";

interface RetrospectiveState {
  retrospectives: DetailRetrospectiveResponse[];
  drafts: DetailRetrospectiveResponse[];
}

let state: RetrospectiveState = {
  retrospectives: MOCK_RETROSPECTIVES,
  drafts: MOCK_DRAFT_RETROSPECTIVES,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** useSyncExternalStore의 getSnapshot — 변경이 없으면 항상 같은 참조를 돌려준다 */
export function getSnapshot(): RetrospectiveState {
  return state;
}

let nextId = 1000;

function createId() {
  nextId += 1;
  return nextId;
}

/** 본문 앞부분을 목록 카드용 요약으로 만든다 */
function toSummary(content: string) {
  const plain = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*`\-_[\]()!]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > 80 ? `${plain.slice(0, 80)}…` : plain;
}

/** 로그인 사용자 정보가 없으므로 작성자 메타는 고정값을 쓴다 */
const AUTHOR_META = {
  grade: 2,
  classNumber: 1,
  teamNumber: 3,
  part: "프론트엔드",
};

function toEntity(
  payload: UpsertRetrospectiveRequest,
  isDraft: boolean,
  base?: DetailRetrospectiveResponse,
): DetailRetrospectiveResponse {
  return {
    ...AUTHOR_META,
    id: base?.id ?? payload.id ?? createId(),
    title: payload.title,
    content: payload.content,
    summary: toSummary(payload.content),
    category: payload.category,
    visibility: payload.visibility,
    relatedWorks: payload.relatedWorks,
    bookmarkCount: base?.bookmarkCount ?? 0,
    isBookmarked: base?.isBookmarked ?? false,
    createdAt: new Date().toISOString().slice(0, 19),
    isDraft,
  };
}

/** 작성 완료 — 임시 저장본에서 올라온 글이면 임시 저장 목록에서 제거한다 */
export function upsertRetrospective(payload: UpsertRetrospectiveRequest) {
  const existing = state.retrospectives.find((item) => item.id === payload.id);
  const entity = toEntity(payload, false, existing);

  state = {
    retrospectives: existing
      ? state.retrospectives.map((item) =>
          item.id === entity.id ? entity : item,
        )
      : [entity, ...state.retrospectives],
    drafts: state.drafts.filter((item) => item.id !== payload.id),
  };
  emit();

  return entity;
}

export function saveDraftRetrospective(payload: UpsertRetrospectiveRequest) {
  const existing = state.drafts.find((item) => item.id === payload.id);
  const entity = toEntity(payload, true, existing);

  state = {
    ...state,
    drafts: existing
      ? state.drafts.map((item) => (item.id === entity.id ? entity : item))
      : [entity, ...state.drafts],
  };
  emit();

  return entity;
}

export function deleteDraftRetrospective(id: number) {
  state = {
    ...state,
    drafts: state.drafts.filter((item) => item.id !== id),
  };
  emit();
}

/** 북마크 토글 — 세션 동안만 유지된다 */
export function toggleBookmark(id: number) {
  let updated: DetailRetrospectiveResponse | undefined;

  state = {
    ...state,
    retrospectives: state.retrospectives.map((item) => {
      if (item.id !== id) return item;
      updated = {
        ...item,
        isBookmarked: !item.isBookmarked,
        bookmarkCount: item.isBookmarked
          ? item.bookmarkCount - 1
          : item.bookmarkCount + 1,
      };
      return updated;
    }),
  };
  emit();

  return updated;
}
