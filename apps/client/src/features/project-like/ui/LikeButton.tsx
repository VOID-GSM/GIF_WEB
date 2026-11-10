"use client";

import { useTranslations } from "next-intl";
import { useToggleProjectLike } from "@/entities/engagement";
import { useRequireLogin } from "@/features/auth-guard";
import { HeartIcon } from "@/shared/ui/EngagementIcons";

interface LikeButtonProps {
  projectId: number;
  isLiked: boolean;
  likeCount: number;
}

// 좋아요 토글 — 비로그인이면 로그인 후 현재 페이지로 돌아온다.
export default function LikeButton({
  projectId,
  isLiked,
  likeCount,
}: LikeButtonProps) {
  const t = useTranslations("project.like");
  const requireLogin = useRequireLogin();
  const toggle = useToggleProjectLike(projectId);

  return (
    <button
      type="button"
      onClick={() => requireLogin(() => toggle.mutate(isLiked))}
      disabled={toggle.isPending}
      aria-pressed={isLiked}
      aria-label={isLiked ? t("unlike") : t("like")}
      className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-default ${
        isLiked
          ? "border-yellow-600 bg-yellow-50 text-yellow-800"
          : "border-gray-200 text-gray-600 hover:bg-gray-100"
      }`}
    >
      <HeartIcon
        filled={isLiked}
        className={`h-4 w-4 ${isLiked ? "text-yellow-600" : ""}`}
      />
      <span>{likeCount.toLocaleString()}</span>
    </button>
  );
}
