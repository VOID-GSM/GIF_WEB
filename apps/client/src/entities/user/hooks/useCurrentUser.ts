"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../api/userApi";

// 같은 GET /api/users/me 를 쓰는 entities/auth(useGetMe)·mypage 훅과 캐시를 공유한다.
// 마이페이지 수정 후 무효화, GitHub 연동·동기화 후 setQueryData 가 모든 화면에 함께 반영된다.
export const CURRENT_USER_QUERY_KEY = ["auth", "me"] as const;

export function useGetCurrentUser() {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
  });
}
