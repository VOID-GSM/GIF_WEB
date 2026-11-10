"use client";

import { SigninCard } from "@repo/ui";

export default function SigninView() {
  // PKCE·state 생성과 검증은 서버(/api/auth/dg/start)가 처리한다.
  const handleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const redirectUri = `${window.location.origin}/callback`;
    window.location.href = `${apiUrl}/api/auth/dg/start?redirectUri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-0">
      <SigninCard onLogin={handleLogin} provider="datagsm" />
    </main>
  );
}
