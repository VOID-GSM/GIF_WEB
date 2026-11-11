"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useConnectGithub } from "@/entities/user";
import { GITHUB_OAUTH_STATE_KEY } from "@/shared/utils/githubOAuth";

import { GithubCallbackLayout, GithubCallbackPending } from "./GithubCallbackLayout";

export default function GithubCallbackView() {
  const t = useTranslations("assessment.githubCallback");
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
    // 사용자가 GitHub 인가 화면에서 취소하면 code 없이 error=access_denied 로 돌아온다.
    const oauthError = searchParams.get("error");
    const savedState = sessionStorage.getItem(GITHUB_OAUTH_STATE_KEY);
    sessionStorage.removeItem(GITHUB_OAUTH_STATE_KEY);

    const isValid = !oauthError && !!code && !!state && state === savedState;
    const invalidMessage =
      oauthError === "access_denied"
        ? t("cancelled")
        : oauthError
          ? t("failed")
          : t("invalid");

    (isValid
      ? connect({ code })
      : Promise.reject(new Error(invalidMessage)))
      .then(() => router.replace("/assessment"))
      .catch(() =>
        setError(isValid ? t("failed") : invalidMessage),
      );
  }, [searchParams, connect, router, t]);

  if (!error) return <GithubCallbackPending />;

  return (
    <GithubCallbackLayout>
      <p className="text-base font-semibold text-red-500">{error}</p>
      <button
        type="button"
        onClick={() => router.replace("/assessment")}
        className="mt-2 rounded-[10px] bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        {t("back")}
      </button>
    </GithubCallbackLayout>
  );
}
