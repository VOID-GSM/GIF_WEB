"use client";

import { useMutation } from "@tanstack/react-query";

import { getOAuthCallback } from "../api";

// DataGSM·Google 로그인 콜백 — provider 에 맞는 콜백 API를 호출한다.
export function useGetOAuthCallback() {
  return useMutation({ mutationFn: getOAuthCallback });
}
