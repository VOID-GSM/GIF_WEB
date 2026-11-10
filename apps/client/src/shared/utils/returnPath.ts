import { sanitizeReturnPath } from "@repo/lib";

import { SEARCH_PARAM_KEYS } from "../constants";

// 복귀 경로 검증·로그인 경로 생성은 admin/ui 와 같은 규칙을 쓰도록 @repo/lib 에 둔다.
export { buildSigninPath, sanitizeReturnPath } from "@repo/lib";

// 회원가입 페이지 경로 — 가입을 마치면 returnTo 로 돌아온다.
export function buildSignupPath(
  returnTo?: string | null,
  basePath = "/signup",
  extraParams: Record<string, string> = {},
) {
  const params = new URLSearchParams(extraParams);
  const safePath = sanitizeReturnPath(returnTo);
  if (safePath) params.set(SEARCH_PARAM_KEYS.REDIRECT, safePath);

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
