"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Coin } from "@repo/ui";

import { COIN_PER_COMMIT } from "@/entities/assessment";
import {
  useDisconnectGithub,
  useGetCurrentUser,
  useSyncGithub,
} from "@/entities/user";
import GithubIcon from "@/shared/ui/GithubIcon";
import { redirectToGithubAuthorize } from "@/shared/utils/githubOAuth";

export default function GithubCoinCard() {
  const t = useTranslations("assessment.github");
  const { data: user, isPending, isError, refetch } = useGetCurrentUser();
  const { mutate: sync, isPending: isSyncing } = useSyncGithub();
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectGithub();
  // 작은 링크라 오클릭이 쉬워, 한 번 더 확인받은 뒤 해제한다.
  const [isConfirmingDisconnect, setIsConfirmingDisconnect] = useState(false);

  const handleDisconnect = () => {
    disconnect(undefined, {
      onSettled: () => setIsConfirmingDisconnect(false),
    });
  };

  const handleConnect = () => {
    if (!redirectToGithubAuthorize()) {
      toast.error(t("notConfigured"));
    }
  };

  const isConnected = !!user?.githubUsername;
  // 동기화 응답이 해제보다 늦게 오면 setQueryData 로 '연동됨'이 되살아나므로 둘을 함께 막는다.
  const isMutating = isSyncing || isDisconnecting;

  return (
    <section className="rounded-[20px] bg-white p-5 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-gray-900">
          {t("title")}
        </h2>
        <GithubIcon className="size-5 text-gray-900" />
      </div>
      <p className="mt-0.5 text-[13px] text-gray-600">
        {t("description")}
      </p>

      <div className="mt-3 flex items-center gap-2 rounded-[12px] bg-yellow-50 px-3 py-2.5">
        <Coin width={18} height={18} aria-hidden />
        <p className="text-[14px] font-semibold text-gray-900">
          {t("perCommit", { coin: COIN_PER_COMMIT })}
        </p>
      </div>

      {isPending ? (
        <div className="mt-4 h-[56px] animate-pulse rounded-[14px] bg-gray-100" />
      ) : isError || !user ? (
        // 조회 실패를 '미연동'으로 오해해 연동 버튼을 보여주지 않도록 별도 상태로 둔다.
        <div className="mt-4 flex items-center justify-between gap-2 rounded-[12px] bg-gray-100 p-2.5">
          <p className="text-[13px] text-gray-600">
            {t("error")}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="shrink-0 rounded-[9px] bg-white px-3 py-2 text-[13px] font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
          >
            {t("retry")}
          </button>
        </div>
      ) : isConnected ? (
        <div className="mt-4 flex items-center gap-2.5 rounded-[12px] bg-gray-100 p-2.5">
          {user.githubAvatarUrl ? (
            // 외부 아바타 URL 이라 next/image 원격 설정 없이 img 로 표시한다.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.githubAvatarUrl}
              alt=""
              className="size-9 rounded-full border border-gray-200"
            />
          ) : (
            <span className="flex size-9 items-center justify-center rounded-full bg-gray-900 text-white">
              <GithubIcon className="size-5" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-gray-900">
              @{user.githubUsername}
            </p>
            {isConfirmingDisconnect ? (
              <div className="flex items-center gap-1.5 text-[12px]">
                <span className="text-gray-600">{t("confirmDisconnect")}</span>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={isMutating}
                  className="font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
                >
                  {isDisconnecting ? t("disconnecting") : t("disconnect")}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDisconnect(false)}
                  disabled={isDisconnecting}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  {t("cancel")}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingDisconnect(true)}
                disabled={isMutating}
                className="text-[12px] text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline disabled:opacity-50"
              >
                {t("unlink")}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => sync()}
            disabled={isMutating}
            className="shrink-0 rounded-[9px] bg-yellow-600 px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-yellow-700 disabled:opacity-60"
          >
            {isSyncing ? t("syncing") : t("sync")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleConnect}
          className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-gray-900 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-gray-900"
        >
          <GithubIcon className="size-5" />
          {t("connect")}
        </button>
      )}
    </section>
  );
}
