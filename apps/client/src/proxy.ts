import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { COOKIE_KEYS } from "@/shared/constants";

const PUBLIC_PATHS = ["/signin", "/callback", "/intro"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!token && !isPublic) {
    // 로그아웃 상태로 루트에 오면 랜딩(/intro)으로, 그 외 보호 경로는 로그인으로 보낸다.
    const target = pathname === "/" ? "/intro" : "/signin";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
