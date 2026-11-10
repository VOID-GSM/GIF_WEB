"use client";

import { Suspense, useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useGetOAuthCallback, type OAuthProvider } from "@/entities/auth";
import {
  COOKIE_KEYS,
  isExternalAllowedPath,
  OAUTH_SESSION_KEYS,
  PUBLIC_HOME_PATH,
} from "@/shared/constants";
import {
  buildSignupPath,
  deleteCookie,
  sanitizeReturnPath,
  setCookie,
} from "@/shared/utils";

// 3학년은 아이디어톤 대상이 아니므로 회원가입/로그인이 차단된다.
// 백엔드는 403 으로 응답하며, 프론트에서도 방어적으로 학번을 확인한다.
const GRADE3_BLOCKED_MESSAGE = "3학년은 회원가입할 수 없습니다.";
// 교내(학생·선생님) 이메일로 Google 로그인하면 서버가 403 으로 막는다.
const GOOGLE_BLOCKED_MESSAGE =
  "교내 계정은 Google 로그인을 사용할 수 없습니다. DataGSM으로 로그인해 주세요.";

// 로그인을 시작할 때 저장한 제공자를 꺼낸다.
// 저장값이 없으면(다른 탭에서 시작 등) Google 콜백에만 붙는 scope 파라미터로 추정한다.
const consumeProvider = (searchParams: URLSearchParams): OAuthProvider => {
  const stored = sessionStorage.getItem(OAUTH_SESSION_KEYS.PROVIDER);
  sessionStorage.removeItem(OAUTH_SESSION_KEYS.PROVIDER);
  if (stored === "google" || stored === "dg") return stored;
  return searchParams.has("scope") ? "google" : "dg";
};

const setOrDeleteCookie = (name: string, value: string | null) => {
  if (value) setCookie(name, value);
  else deleteCookie(name);
};

const CallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { mutateAsync: getOAuthCallback } = useGetOAuthCallback();

  const [error, setError] = useState<string | null>(null);
  const hasRequested = useRef(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleCallback = async () => {
      if (hasRequested.current) return;
      hasRequested.current = true;

      const provider = consumeProvider(new URLSearchParams(searchParams));

      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || !state) throw new Error("인가 코드가 누락되었습니다.");

        const { data } = await getOAuthCallback({ provider, code, state });
        const isExternal = data.accountType === "EXTERNAL";

        if (!isExternal && data.studentNumber?.startsWith("3")) {
          throw new Error(GRADE3_BLOCKED_MESSAGE);
        }

        setCookie(COOKIE_KEYS.ACCESS_TOKEN, data.accessToken);
        // 이전 계정의 값이 남지 않도록 응답에 없으면 지운다.
        setOrDeleteCookie(COOKIE_KEYS.ACCOUNT_TYPE, data.accountType);
        setOrDeleteCookie(COOKIE_KEYS.CLIENT_ROLE, data.clientRole);
        // QueryClient가 앱 전체에서 하나라 로그아웃 없이 계정이 바뀌어도
        // 이전 계정의 isLiked·isMine 등이 남지 않도록 캐시를 비운다.
        queryClient.clear();

        // 서버가 검증했지만 프론트에서도 내부 상대 경로만 허용한다.
        const returnTo = sanitizeReturnPath(data.returnTo);

        if (isExternal) {
          // 외부 사용자는 회원가입(포지션 선택) 없이 공개 페이지만 이용한다.
          const canReturn =
            returnTo && isExternalAllowedPath(returnTo.split(/[?#]/)[0]);
          router.replace(canReturn ? returnTo : PUBLIC_HOME_PATH);
          return;
        }

        if (data.clientRole) {
          router.replace(returnTo ?? "/");
          return;
        }
        // 첫 로그인이면 회원가입을 마친 뒤 원래 페이지로 돌아오도록 경로를 넘긴다.
        router.replace(buildSignupPath(returnTo));
      } catch (err) {
        const status = (err as { response?: { status?: number } })?.response
          ?.status;
        const axiosMessage =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message;
        // 403 은 사유가 분명하므로 제공자별 안내 문구를 고정한다.
        // (DataGSM: 3학년 차단, Google: 교내 계정 이메일 차단)
        const message =
          status === 403
            ? provider === "google"
              ? GOOGLE_BLOCKED_MESSAGE
              : GRADE3_BLOCKED_MESSAGE
            : (axiosMessage ??
              (err instanceof Error
                ? err.message
                : "로그인 중 오류가 발생했습니다."));
        setError(message);
        toast.error(message);
        timeoutId = setTimeout(() => router.replace("/signin"), 3000);
      }
    };

    void handleCallback();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, searchParams, getOAuthCallback, queryClient]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-[20px] shadow-new px-10 py-12 flex flex-col items-center gap-4 w-[400px] text-center">
        {error ? (
          <>
            <p className="text-base font-semibold text-red-500">로그인 실패</p>
            <p className="text-sm text-gray-800">{error}</p>
            <p className="text-xs text-gray-500">
              잠시 후 로그인 페이지로 이동합니다.
            </p>
          </>
        ) : (
          <>
            <p className="text-base font-semibold text-black">로그인 처리 중</p>
            <p className="text-sm text-gray-600">잠시만 기다려주세요.</p>
          </>
        )}
      </div>
    </main>
  );
};

const CallbackFallback = () => (
  <main className="min-h-screen flex items-center justify-center bg-background">
    <div className="bg-white rounded-[20px] shadow-new px-10 py-12 flex flex-col items-center gap-4 w-[400px] text-center">
      <p className="text-base font-semibold text-black">로그인 처리 중</p>
      <p className="text-sm text-gray-600">잠시만 기다려주세요.</p>
    </div>
  </main>
);

export default function CallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <CallbackContent />
    </Suspense>
  );
}
