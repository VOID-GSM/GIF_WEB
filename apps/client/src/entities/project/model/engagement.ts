// 프로젝트 참여 지표 (조회수·좋아요·댓글).
// 서버가 필드를 빠뜨려 보내는 경우가 있어, 응답 타입(RawEngagement)에서는 optional 로 두고
// withEngagementDefaults 로 정규화한 뒤 캐시에 넣는다.
// TODO: 백엔드(VOID-GSM/GIF_SERVER#190) 배포로 필드가 항상 내려오면 정규화를 제거한다.
export interface EngagementFields {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  // null: 서버가 값을 내려주지 않아 알 수 없음 — 잘못된 POST/DELETE 를 막기 위해 좋아요 버튼을 비활성화한다.
  isLiked: boolean | null;
}

export type EngagementKey = keyof EngagementFields;

// 응답 타입 — 참여 지표 필드만 optional 로 바꾼다. (유니온 타입에도 멤버별로 적용)
export type RawEngagement<T> = T extends unknown
  ? Omit<T, EngagementKey> & {
      [K in keyof T & EngagementKey]?: Exclude<T[K], null>;
    }
  : never;

export const DETAIL_ENGAGEMENT_KEYS = [
  "viewCount",
  "likeCount",
  "commentCount",
  "isLiked",
] as const satisfies readonly EngagementKey[];

export const LIST_ENGAGEMENT_KEYS = [
  "likeCount",
  "commentCount",
  "isLiked",
] as const satisfies readonly EngagementKey[];

const ENGAGEMENT_DEFAULTS: EngagementFields = {
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  isLiked: null,
};

// 목록 응답이면 카드마다 경고가 찍히므로 필드별로 한 번만 남긴다.
const warnedKeys = new Set<EngagementKey>();

export function withEngagementDefaults<T extends Partial<EngagementFields>>(
  raw: RawEngagement<T>,
  keys: readonly (keyof T & EngagementKey)[],
): T {
  const project = { ...raw } as Partial<EngagementFields>;

  keys.forEach((key) => {
    if (project[key] != null) return;
    if (!warnedKeys.has(key)) {
      warnedKeys.add(key);
      console.warn(
        `[engagement] 서버 응답에 ${key} 필드가 없어 기본값으로 대체합니다. 백엔드 배포 상태를 확인해 주세요.`,
      );
    }
    Object.assign(project, { [key]: ENGAGEMENT_DEFAULTS[key] });
  });

  return project as T;
}
