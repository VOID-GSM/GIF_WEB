"use client";

import { Suspense, useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useGetGoogleCallback } from "@/entities/auth";
import { COOKIE_KEYS } from "@/shared/constants";
import { setCookie } from "@/shared/utils";

const CallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: getGoogleCallback } = useGetGoogleCallback();

  const [error, setError] = useState<string | null>(null);
  const hasRequested = useRef(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleCallback = async () => {
      if (hasRequested.current) return;
      hasRequested.current = true;

      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || !state) throw new Error("인가 코드가 누락되었습니다.");

        const { data } = await getGoogleCallback({ code, state });

        setCookie(COOKIE_KEYS.ACCESS_TOKEN, data.accessToken);
        router.replace(data.adminRole ? "/" : "/signup");
      } catch (err) {
        const axiosMessage =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message;
        const message =
          axiosMessage ??
          (err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.");
        setError(message);
        timeoutId = setTimeout(() => router.replace("/signin"), 3000);
      }
    };

    void handleCallback();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, searchParams, getGoogleCallback]);

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
