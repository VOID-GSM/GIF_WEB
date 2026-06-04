"use client";

import { SigninCard } from "@repo/ui";

export default function SigninView() {
  const handleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const redirectUri = `${window.location.origin}/callback`;
    window.location.href = `${apiUrl}/api/auth/dg/start?redirectUri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-0">
      <SigninCard onLogin={handleLogin} />
    </main>
  );
}
