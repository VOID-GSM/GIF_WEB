import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

// 콜백 화면과 Suspense fallback 이 같은 카드를 써서 전환 시 깜빡이지 않게 한다.
export function GithubCallbackLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-3 rounded-[20px] bg-white px-10 py-12 text-center shadow-new">
        {children}
      </div>
    </div>
  );
}

export function GithubCallbackPending() {
  const t = useTranslations("assessment.githubCallback");
  return (
    <GithubCallbackLayout>
      <p className="text-base font-semibold text-gray-900">{t("pending")}</p>
      <p className="text-sm text-gray-600">{t("wait")}</p>
    </GithubCallbackLayout>
  );
}
