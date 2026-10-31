"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useConnectGithub } from "@/entities/user";
import { GITHUB_OAUTH_STATE_KEY } from "@/shared/utils/githubOAuth";

export default function GithubCallbackView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: connect } = useConnectGithub();
  const [error, setError] = useState<string | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const savedState = sessionStorage.getItem(GITHUB_OAUTH_STATE_KEY);
    sessionStorage.removeItem(GITHUB_OAUTH_STATE_KEY);

    const isValid = !!code && !!state && state === savedState;

    (isValid
      ? connect({ code })
      : Promise.reject(new Error("잘못된 연동 요청입니다.")))
      .then(() => router.replace("/assessment"))
      .catch(() =>
        setError(
          isValid ? "GitHub 연동에 실패했습니다." : "잘못된 연동 요청입니다.",
        ),
      );
  }, [searchParams, connect, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-3 rounded-[20px] bg-white px-10 py-12 text-center shadow-new">
        {error ? (
          <>
            <p className="text-base font-semibold text-red-500">{error}</p>
            <button
              type="button"
              onClick={() => router.replace("/assessment")}
              className="mt-2 rounded-[10px] bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              역량검사로 돌아가기
            </button>
          </>
        ) : (
          <>
            <p className="text-base font-semibold text-gray-900">
              GitHub 연동 중
            </p>
            <p className="text-sm text-gray-600">잠시만 기다려주세요.</p>
          </>
        )}
      </div>
    </div>
  );
}
