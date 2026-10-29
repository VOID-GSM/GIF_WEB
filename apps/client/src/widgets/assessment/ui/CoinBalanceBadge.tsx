"use client";

import { Coin } from "@repo/ui";

import { useGetCurrentUser } from "@/entities/user";

export default function CoinBalanceBadge() {
  const { data, isPending } = useGetCurrentUser();

  return (
    <div className="flex h-10 min-w-[120px] items-center gap-2 rounded-full border border-gray-300 bg-white py-2 pl-2.5 pr-4 shadow-sm">
      <Coin width={22} height={22} aria-hidden />
      <span className="sr-only">보유 코인</span>
      {isPending ? (
        <span className="ml-auto h-5 w-12 animate-pulse rounded bg-gray-200" />
      ) : (
        <span className="ml-auto text-[17px] font-bold leading-none tracking-[-0.4px] text-gray-900 tabular-nums">
          {(data?.coinBalance ?? 0).toLocaleString()}
        </span>
      )}
    </div>
  );
}
