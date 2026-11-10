"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { LanguageToggle, SigninCard } from "@repo/ui";

import type { OAuthProvider } from "@/entities/auth";
import { OAUTH_SESSION_KEYS, SEARCH_PARAM_KEYS } from "@/shared/constants";
import { sanitizeReturnPath } from "@/shared/utils";

export default function SigninView() {
  const t = useTranslations("auth.signin");
  const searchParams = useSearchParams();
  // 로그인 후 돌아갈 경로 — 서버가 OAuth state 에 담았다가 콜백 응답(returnTo)으로 돌려준다.
  const returnTo = sanitizeReturnPath(
    searchParams.get(SEARCH_PARAM_KEYS.REDIRECT),
  );

  const startLogin = (provider: OAuthProvider) => {
    // DataGSM·Google 모두 같은 /callback 으로 돌아오므로 어느 쪽인지 기억해 둔다.
    sessionStorage.setItem(OAUTH_SESSION_KEYS.PROVIDER, provider);

    const params = new URLSearchParams({
      redirectUri: `${window.location.origin}/callback`,
    });
    if (returnTo) params.set("returnTo", returnTo);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    window.location.href = `${apiUrl}/api/auth/${provider}/start?${params}`;
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background p-4 md:p-0">
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <LanguageToggle />
      </div>
      <SigninCard
        onLogin={() => startLogin("dg")}
        secondary={{
          provider: "google",
          onLogin: () => startLogin("google"),
          caption: t("visitorCaption"),
        }}
      />
    </main>
  );
}
