// 복귀 경로 검증·로그인 경로 생성은 admin/ui 와 같은 규칙을 쓰도록 @repo/lib 에 둔다.
export { buildSigninPath, sanitizeReturnPath } from "@repo/lib";
