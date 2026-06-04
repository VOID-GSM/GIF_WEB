"use client";

import { SigninCard } from "@repo/ui";

import { OAUTH_SESSION_KEYS } from "@/shared/constants";
import {
  createAuthorizeUrl,
  generateCodeChallenge,
  generateCodeVerifier,
} from "@/shared/utils";

export default function SigninView() {
  const handleLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_DATAGSM_OAUTH_CLIENT_ID;
    if (!clientId) throw new Error("OAuth 환경 변수가 설정되지 않았습니다.");

    const state = crypto.randomUUID();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const redirectUri = `${window.location.origin}/callback`;

    sessionStorage.setItem(OAUTH_SESSION_KEYS.STATE, state);
    sessionStorage.setItem(OAUTH_SESSION_KEYS.CODE_VERIFIER, codeVerifier);

    window.location.href = createAuthorizeUrl({
      clientId,
      redirectUri,
      state,
      codeChallenge,
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-0">
      <SigninCard onLogin={handleLogin} />
    </main>
  );
}
