"use client";

import { Suspense, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { usePostSignIn } from "@/entities/auth";
import { COOKIE_KEYS, OAUTH_SESSION_KEYS } from "@/shared/constants";
import { setCookie } from "@/shared/utils";

const CallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: signIn } = usePostSignIn();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const authCode = searchParams.get("code");
        const callbackState = searchParams.get("state");
        const redirectUri = `${window.location.origin}/callback`;

        if (!authCode) throw new Error("인가 코드가 누락되었습니다.");

        const savedState = sessionStorage.getItem(OAUTH_SESSION_KEYS.STATE);
        if (!savedState || callbackState !== savedState)
          throw new Error("잘못된 인증 요청입니다. 다시 로그인해주세요.");

        const codeVerifier = sessionStorage.getItem(
          OAUTH_SESSION_KEYS.CODE_VERIFIER,
        );
        if (!codeVerifier)
          throw new Error("PKCE 검증 정보가 없습니다. 다시 로그인해주세요.");

        const { data } = await signIn({ authCode, redirectUri, codeVerifier });

        setCookie(COOKIE_KEYS.ACCESS_TOKEN, data.accessToken);
        router.replace("/");
      } catch (err) {
        const axiosMessage =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message;
        const message =
          axiosMessage ??
          (err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.");
        console.error("[OAuth Callback Error]", {
          message: (err as Error)?.message,
          status: (err as { response?: { status?: number } })?.response?.status,
          data: (err as { response?: { data?: unknown } })?.response?.data,
        });
        setError(message);
        setTimeout(() => router.replace("/signin"), 3000);
      } finally {
        sessionStorage.removeItem(OAUTH_SESSION_KEYS.STATE);
        sessionStorage.removeItem(OAUTH_SESSION_KEYS.CODE_VERIFIER);
      }
    };

    void handleCallback();
  }, [router, searchParams, signIn]);

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
