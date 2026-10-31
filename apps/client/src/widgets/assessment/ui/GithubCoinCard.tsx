"use client";

import { toast } from "sonner";

import {
  useDisconnectGithub,
  useGetCurrentUser,
  useSyncGithub,
} from "@/entities/user";
import GithubIcon from "@/shared/ui/GithubIcon";
import { redirectToGithubAuthorize } from "@/shared/utils/githubOAuth";

export default function GithubCoinCard() {
  const { data: user, isPending } = useGetCurrentUser();
  const { mutate: sync, isPending: isSyncing } = useSyncGithub();
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectGithub();

  const handleConnect = () => {
    if (!redirectToGithubAuthorize()) {
      toast.error("GitHub 연동 설정이 아직 준비되지 않았어요.");
    }
  };

  const isConnected = !!user?.githubUsername;

  return (
    <section className="rounded-[20px] bg-white p-5 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-gray-900">
          커밋으로 코인 받기
        </h2>
        <GithubIcon className="size-5 text-gray-900" />
      </div>
      <p className="mt-0.5 text-[13px] text-gray-600">
        GitHub 커밋이 늘어날수록 코인이 쌓여요.
      </p>

      {isPending ? (
        <div className="mt-4 h-[56px] animate-pulse rounded-[14px] bg-gray-100" />
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
            <button
              type="button"
              onClick={() => disconnect()}
              disabled={isDisconnecting}
              className="text-[12px] text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline disabled:opacity-50"
            >
              연동 해제
            </button>
          </div>
          <button
            type="button"
            onClick={() => sync()}
            disabled={isSyncing}
            className="shrink-0 rounded-[9px] bg-yellow-600 px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-yellow-700 disabled:opacity-60"
          >
            {isSyncing ? "동기화 중…" : "커밋 동기화"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleConnect}
          className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-gray-900 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-gray-900"
        >
          <GithubIcon className="size-5" />
          GitHub 연동하기
        </button>
      )}
    </section>
  );
}
