"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import { setSessionExpected } from "@repo/lib";

import type { AccountType } from "./types";

interface AuthSessionValue {
  isLoggedIn: boolean;
  accountType: AccountType | null;
}

export interface AuthSession extends AuthSessionValue {
  // 비로그인 사용자
  isGuest: boolean;
  // 외부 사용자(Google 로그인) — 공개 페이지·좋아요·댓글·역량검사·Thyn 꾸미기만 이용
  isExternal: boolean;
  // 팀 프로젝트 관리·양식 작성 등 교내 기능을 쓸 수 있는 사용자
  canManageTeam: boolean;
}

const AuthSessionContext = createContext<AuthSessionValue>({
  isLoggedIn: false,
  accountType: null,
});

interface AuthSessionProviderProps extends AuthSessionValue {
  children: ReactNode;
}

// 레이아웃(Server Component)이 쿠키로 읽은 로그인 상태를 내려준다.
// 서버·클라이언트가 같은 값으로 렌더링되어 비로그인 화면이 깜빡이지 않는다.
export function AuthSessionProvider({
  isLoggedIn,
  accountType,
  children,
}: AuthSessionProviderProps) {
  // 로그인 화면이면 토큰 쿠키가 만료돼 빠진 요청의 401 도 세션 만료로 처리하게 한다.
  // 하위 컴포넌트의 첫 요청보다 먼저 반영되도록 effect 가 아닌 렌더 중에 알린다.
  if (typeof window !== "undefined") setSessionExpected(isLoggedIn);

  const value = useMemo(
    () => ({ isLoggedIn, accountType }),
    [isLoggedIn, accountType],
  );
  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSession {
  const { isLoggedIn, accountType } = useContext(AuthSessionContext);
  const isExternal = isLoggedIn && accountType === "EXTERNAL";

  return {
    isLoggedIn,
    accountType,
    isGuest: !isLoggedIn,
    isExternal,
    canManageTeam: isLoggedIn && !isExternal,
  };
}
