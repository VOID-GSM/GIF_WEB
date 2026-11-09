import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  COOKIE_KEYS,
  isExternalAllowedPath,
  isPublicPath,
  PUBLIC_HOME_PATH,
  REDIRECT_REASONS,
  SEARCH_PARAM_KEYS,
} from "@/shared/constants";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const accountType = request.cookies.get(COOKIE_KEYS.ACCOUNT_TYPE)?.value;
  const { pathname, search } = request.nextUrl;

  if (!token) {
    if (isPublicPath(pathname)) return NextResponse.next();

    // 로그아웃 상태로 루트에 오면 랜딩(/intro)으로 보낸다.
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/intro", request.url));
    }

    // 그 외 보호 경로는 로그인 후 원래 페이지로 돌아오도록 경로를 넘긴다.
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set(SEARCH_PARAM_KEYS.REDIRECT, `${pathname}${search}`);
    return NextResponse.redirect(signinUrl);
  }

  // 외부 사용자는 재학생 전용 페이지(팀 관리·양식 등) 대신 공개 목록으로 보낸다.
  if (accountType === "EXTERNAL" && !isExternalAllowedPath(pathname)) {
    const homeUrl = new URL(PUBLIC_HOME_PATH, request.url);
    // 메인(/)은 외부 사용자의 홈이 공개 목록일 뿐이므로 안내하지 않는다.
    if (pathname !== "/") {
      homeUrl.searchParams.set(
        SEARCH_PARAM_KEYS.REASON,
        REDIRECT_REASONS.EXTERNAL_ONLY,
      );
    }
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
