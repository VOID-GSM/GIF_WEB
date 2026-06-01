"use client";

import { SigninCard } from "@repo/ui";

export default function SigninView() {
  const handleLogin = () => {
    window.location.href =
      process.env.NEXT_PUBLIC_DATAGSM_AUTH_URL ?? "/api/auth/signin";
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <SigninCard onLogin={handleLogin} />
    </main>
  );
}
