// 비로그인·외부 사용자가 머무는 공개 프로젝트 목록
export const PUBLIC_HOME_PATH = "/projects";

// 로그인 없이 접근할 수 있는 경로 (하위 경로 포함)
const PUBLIC_PATH_PREFIXES = ["/signin", "/callback", "/intro"];

// 로그인 없이 접근할 수 있는 개별 경로 — 프로젝트 목록·상세만 공개한다.
// /projects/create, /projects/{id}/edit 은 로그인이 필요하다.
const PUBLIC_PATH_PATTERNS = [/^\/projects\/?$/, /^\/projects\/\d+\/?$/];

export const matchesPathPrefix = (pathname: string, prefixes: string[]) =>
  prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

export const isPublicPath = (pathname: string) =>
  matchesPathPrefix(pathname, PUBLIC_PATH_PREFIXES) ||
  PUBLIC_PATH_PATTERNS.some((pattern) => pattern.test(pathname));

// 외부 사용자(Google 로그인)는 공개 페이지만 이용할 수 있다.
// 팀 관리(내 프로젝트·양식·제출 등)는 재학생 전용이다.
export const isExternalAllowedPath = isPublicPath;
