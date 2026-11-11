"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { useAuthSession } from "@/entities/auth";
import {
  COMMENT_MAX_LENGTH,
  useCreateProjectComment,
  useDeleteProjectComment,
  useGetProjectComments,
  type ProjectComment,
} from "@/entities/engagement";
import { useRequireLogin } from "@/features/auth-guard";
import { formatRelativeTime } from "@/shared/utils";

interface ProjectCommentSectionProps {
  projectId: number;
}

// 댓글 작성 폼 — 비로그인이면 입력 영역이 로그인 안내 역할을 한다.
function CommentForm({ projectId }: ProjectCommentSectionProps) {
  const t = useTranslations("comment");
  const { isGuest } = useAuthSession();
  const requireLogin = useRequireLogin();
  const createComment = useCreateProjectComment(projectId);
  const [content, setContent] = useState("");

  const trimmed = content.trim();
  const canSubmit = trimmed.length > 0 && !createComment.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    createComment.mutate(
      { content: trimmed },
      { onSuccess: () => setContent("") },
    );
  };

  if (isGuest) {
    return (
      <button
        type="button"
        onClick={() => requireLogin(() => {})}
        className="flex h-[96px] w-full cursor-pointer items-start rounded-[12px] border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-400 transition-colors hover:border-yellow-600"
      >
        {t("loginPrompt")}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-[12px] border border-gray-200 bg-white px-4 py-3 transition-colors focus-within:border-yellow-600"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={COMMENT_MAX_LENGTH}
        rows={3}
        placeholder={t("placeholder")}
        aria-label={t("inputLabel")}
        className="w-full resize-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
      />
      <div className="flex items-center justify-end gap-3">
        <span className="text-xs text-gray-500">
          {content.length}/{COMMENT_MAX_LENGTH}
        </span>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-yellow-600 px-5 py-1.5 text-sm font-semibold text-gray-900 transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-40"
        >
          {createComment.isPending ? t("submitting") : t("submit")}
        </button>
      </div>
    </form>
  );
}

interface CommentItemProps {
  projectId: number;
  comment: ProjectComment;
}

// 댓글 한 줄 — 본인 댓글이면 2단계(삭제 → 확인/취소)로 삭제한다.
function CommentItem({ projectId, comment }: CommentItemProps) {
  const t = useTranslations("comment");
  const locale = useLocale();
  const deleteComment = useDeleteProjectComment(projectId);
  const [confirming, setConfirming] = useState(false);
  const { author } = comment;
  const authorName = author.name ?? t("unknown");

  return (
    <li className="flex gap-3 py-4">
      {author.profileImage ? (
        // 프로필 이미지는 외부 URL이라 next/image 대신 img 사용
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={author.profileImage}
          alt={authorName}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-sm font-semibold text-yellow-800"
        >
          {author.name?.charAt(0) ?? "?"}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-gray-900">
            {authorName}
          </span>
          <time
            dateTime={comment.createdAt}
            className="shrink-0 text-xs text-gray-500"
          >
            {formatRelativeTime(comment.createdAt, locale)}
          </time>

          {comment.isMine && (
            <div className="ml-auto flex shrink-0 items-center gap-2 text-xs">
              {confirming ? (
                <>
                  <span className="text-gray-500">{t("deleteConfirm")}</span>
                  <button
                    type="button"
                    disabled={deleteComment.isPending}
                    onClick={() =>
                      deleteComment.mutate(comment.id, {
                        onSettled: () => setConfirming(false),
                      })
                    }
                    className="cursor-pointer font-semibold text-red-600 disabled:cursor-default disabled:opacity-50"
                  >
                    {t("confirm")}
                  </button>
                  <button
                    type="button"
                    disabled={deleteComment.isPending}
                    onClick={() => setConfirming(false)}
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                  >
                    {t("cancel")}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {t("delete")}
                </button>
              )}
            </div>
          )}
        </div>
        <p className="whitespace-pre-wrap break-words text-sm text-gray-800">
          {comment.content}
        </p>
      </div>
    </li>
  );
}

// 프로젝트 댓글 — 목록은 누구나 볼 수 있고, 작성은 로그인(재학생·외부 사용자) 후 가능하다.
export default function ProjectCommentSection({
  projectId,
}: ProjectCommentSectionProps) {
  const t = useTranslations("comment");
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetProjectComments(projectId);

  // 페이지 번호 기반 + 최신순이라 더보기 사이에 댓글이 추가되면 경계가 밀려
  // 같은 댓글이 두 페이지에 올 수 있다 — id 기준으로 처음 나온 것만 남긴다.
  const seenIds = new Set<number>();
  const comments = (data?.pages.flatMap((page) => page.content) ?? []).filter(
    (comment) => {
      if (seenIds.has(comment.id)) return false;
      seenIds.add(comment.id);
      return true;
    },
  );
  const total = data?.pages[0]?.totalElements ?? 0;

  const renderList = () => {
    if (isPending) {
      return (
        <p className="py-8 text-center text-sm text-gray-500">
          {t("loading")}
        </p>
      );
    }
    if (isError) {
      return (
        <p className="py-8 text-center text-sm text-gray-500">
          {t("loadError")}
        </p>
      );
    }
    if (comments.length === 0) {
      return (
        <p className="py-8 text-center text-sm text-gray-500">
          {t("empty")}
        </p>
      );
    }
    return (
      <ul className="divide-y divide-gray-200">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            projectId={projectId}
            comment={comment}
          />
        ))}
      </ul>
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">
        {t.rich("count", {
          count: total.toLocaleString(),
          hl: (chunks) => <span className="text-yellow-700">{chunks}</span>,
        })}
      </h2>

      <CommentForm projectId={projectId} />

      {renderList()}

      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto cursor-pointer rounded-full border border-gray-200 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-default disabled:opacity-50"
        >
          {isFetchingNextPage ? t("loadingMore") : t("more")}
        </button>
      )}
    </section>
  );
}
