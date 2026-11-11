"use client";

import { Suspense, useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useGetDgCallback } from "@/entities/auth";
import { COOKIE_KEYS } from "@/shared/constants";
import { deleteCookie, setCookie } from "@/shared/utils";

// 서버는 DataGSM 선생님 계정에만 ADMIN 역할을 준다. ADMIN이 아닌 계정(학생·외부 등)은 admin에 들어올 수 없다.
const NOT_ADMIN_MESSAGE =
  "선생님 계정만 관리자 페이지에 로그인할 수 있습니다.";

const CallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: getDgCallback } = useGetDgCallback();

  const [error, setError] = useState<string | null>(null);
  const hasRequested = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleCallback = async () => {
      if (hasRequested.current) return;
      hasRequested.current = true;

      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || !state) throw new Error("인가 코드가 누락되었습니다.");

        const { data } = await getDgCallback({ code, state });

        if (!isMounted) return;

        // 토큰을 저장하기 전에 차단해야 학생이 admin 세션을 갖지 않는다.
        // 같은 브라우저에 남아 있던 이전 관리자 세션도 함께 정리한다.
        if (data.role !== "ADMIN") {
          deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
          throw new Error(NOT_ADMIN_MESSAGE);
        }

        setCookie(COOKIE_KEYS.ACCESS_TOKEN, data.accessToken);
        // 모든 관리자는 DataGSM 계정으로 가입한다. 역할이 없으면 가입 절차로 보낸다.
        router.replace(data.adminRole ? "/" : "/signup");
      } catch (err) {
        if (!isMounted) return;

        const status = (err as { response?: { status?: number } })?.response
          ?.status;
        const axiosMessage =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message;
        // 서버가 ADMIN이 아닌 계정을 403으로 막아도 client와 같은 고정 문구를 보여준다.
        if (status === 403) deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
        const message =
          status === 403
            ? NOT_ADMIN_MESSAGE
            : (axiosMessage ??
              (err instanceof Error
                ? err.message
                : "로그인 중 오류가 발생했습니다."));
        setError(message);
        timeoutId = setTimeout(() => {
          if (isMounted) router.replace("/signin");
        }, 3000);
      }
    };

    void handleCallback();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, searchParams, getDgCallback]);

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
