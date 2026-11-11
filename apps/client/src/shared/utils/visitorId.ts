// 비로그인 방문자의 조회수 중복 집계를 막기 위한 식별자.
// 서버 규칙: /^[A-Za-z0-9_-]{16,64}$/
const VISITOR_ID_STORAGE_KEY = "gif_visitor_id";
const VISITOR_ID_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

let memoryVisitorId: string | null = null;

const generateVisitorId = () => {
  if (typeof crypto !== "undefined") {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    // randomUUID 는 보안 컨텍스트(HTTPS·localhost)에서만 제공되므로 대체 경로를 둔다.
    if (typeof crypto.getRandomValues === "function") {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    }
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`.padEnd(
    16,
    "0",
  );
};

const getMemoryVisitorId = () => {
  if (!memoryVisitorId) memoryVisitorId = generateVisitorId();
  return memoryVisitorId;
};

// localStorage 에 저장된 방문자 ID 를 돌려주고, 없거나 형식이 틀리면 새로 만든다.
// 저장소를 쓸 수 없으면(사생활 보호 모드·SSR 등) 메모리 ID 로 대신한다.
export function getOrCreateVisitorId() {
  try {
    const stored = window.localStorage.getItem(VISITOR_ID_STORAGE_KEY);
    if (stored && VISITOR_ID_PATTERN.test(stored)) return stored;

    const visitorId = generateVisitorId();
    window.localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
    return visitorId;
  } catch {
    return getMemoryVisitorId();
  }
}
