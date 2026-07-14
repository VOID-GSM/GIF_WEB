"use client";

import { Suspense, useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useGetDgCallback } from "@/entities/auth";
import { COOKIE_KEYS } from "@/shared/constants";
import { setCookie } from "@/shared/utils";

// 3학년은 아이디어톤 대상이 아니므로 회원가입/로그인이 차단된다.
// 백엔드는 403 으로 응답하며, 프론트에서도 방어적으로 학번을 확인한다.
const GRADE3_BLOCKED_MESSAGE = "3학년은 회원가입할 수 없습니다.";

const CallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: getDgCallback } = useGetDgCallback();

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

        const { data } = await getDgCallback({ code, state });

        if (data.studentNumber?.startsWith("3")) {
          throw new Error(GRADE3_BLOCKED_MESSAGE);
        }

        setCookie(COOKIE_KEYS.ACCESS_TOKEN, data.accessToken);
        if (data.clientRole) setCookie(COOKIE_KEYS.CLIENT_ROLE, data.clientRole);
        router.replace(data.clientRole ? "/" : "/signup");
      } catch (err) {
        const status = (err as { response?: { status?: number } })?.response
          ?.status;
        const axiosMessage =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message;
        // 3학년 차단(403)은 사유가 분명하므로 안내 문구를 고정한다.
        const message =
          status === 403
            ? GRADE3_BLOCKED_MESSAGE
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
