"use client";

import { useMemo, useState } from "react";
import { useMutationState } from "@tanstack/react-query";

import {
  commentMutationKeys,
  useDeleteComment,
  useGetAdminComments,
  useHideComment,
  useUnhideComment,
  type AdminComment,
} from "@/entities/comment";
import { useGetMyInfo } from "@/entities/mypage";
import { useGetProjectStats } from "@/entities/project-stats";
import { PRIVILEGED_ADMIN_EMAIL } from "@/shared/constants";

import CommentRow from "./CommentRow";
import DeleteCommentConfirmModal from "./DeleteCommentConfirmModal";

const PAGE_SIZE = 20;

const SELECT_CLASS =
  "h-9 max-w-full cursor-pointer rounded-[8px] border border-gray-300 bg-white px-2.5 text-[13px] text-gray-700 outline-none focus:border-yellow-600 dark:bg-gray-900 dark:text-gray-200";

export default function CommentManagementView() {
  const { data: myInfo, isLoading: isMyInfoLoading } = useGetMyInfo();
  // 댓글 관리는 VOID 권한 계정(또는 운영 계정)만 사용한다.
  const isVoid =
    myInfo?.adminRole === "VOID" || myInfo?.email === PRIVILEGED_ADMIN_EMAIL;

  const [projectId, setProjectId] = useState<number | undefined>();
  const [author, setAuthor] = useState<{ userId: number; name: string }>();
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminComment | null>(null);

  const {
    data,
    isLoading: isCommentsLoading,
    isError,
    isPlaceholderData,
  } = useGetAdminComments(
    { projectId, userId: author?.userId, page, size: PAGE_SIZE },
    isVoid,
  );

  // 프로젝트 필터 목록과 projectId → 팀명 표시에 통계 API의 프로젝트 목록을 재사용한다.
  const { data: projects } = useGetProjectStats({ sort: "VIEWS" }, isVoid);
  // 팀명이 없는 프로젝트는 프로젝트 이름으로 대신 표시한다.
  const projectOptions = useMemo(
    () =>
      (projects ?? [])
        .map((p) => ({
          projectId: p.projectId,
          label: p.teamName ?? p.name ?? `#${p.projectId}`,
          grade: p.grade,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, "ko")),
    [projects],
  );
  const projectNameMap = useMemo(
    () => new Map(projectOptions.map((p) => [p.projectId, p.label] as const)),
    [projectOptions],
  );

  const hideMutation = useHideComment();
  const unhideMutation = useUnhideComment();
  const deleteMutation = useDeleteComment();

  const totalElements = data?.totalElements ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalElements / PAGE_SIZE));
  const comments = data?.content ?? [];

  // 마지막 페이지의 댓글을 모두 지우면 빈 페이지가 되므로 한 페이지 앞으로 보낸다.
  if (data && comments.length === 0 && page > 1 && !isPlaceholderData) {
    setPage(page - 1);
  }

  // 여러 댓글을 연달아 처리해도 요청 중인 댓글마다 버튼을 막는다.
  const pendingIds = useMutationState({
    filters: { mutationKey: commentMutationKeys.all, status: "pending" },
    select: (mutation) => mutation.state.variables as number,
  });

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  if (isMyInfoLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-[13px] font-medium text-gray-400">불러오는 중</p>
      </div>
    );
  }

  if (!isVoid) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-4">
        <p className="text-[13px] font-medium text-gray-400">
          이 페이지는 VOID 권한 계정만 접근할 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full justify-center bg-background">
      <div className="flex h-full w-full max-w-[720px] flex-col px-4 py-8">
        <div className="shrink-0 border-b border-gray-200 pb-4">
          <h1 className="text-[19px] font-semibold tracking-[-0.3px] text-gray-900">
            댓글 관리
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
            부적절한 댓글을 숨기거나 삭제할 수 있습니다. 숨긴 댓글은 학생
            화면에서 보이지 않습니다.
            {data && ` (전체 ${totalElements}개)`}
          </p>
        </div>

        {/* 필터 */}
        <div className="mt-4 flex shrink-0 flex-wrap items-center gap-2">
          <select
            aria-label="프로젝트"
            className={SELECT_CLASS}
            value={projectId ?? ""}
            onChange={(e) => {
              setProjectId(
                e.target.value ? Number(e.target.value) : undefined,
              );
              setPage(1);
            }}
          >
            <option value="">전체 프로젝트</option>
            {projectOptions.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.label}
                {p.grade ? ` (${p.grade}학년)` : ""}
              </option>
            ))}
          </select>

          {author && (
            <button
              type="button"
              onClick={() => {
                setAuthor(undefined);
                setPage(1);
              }}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-yellow-600 bg-yellow-50 px-3 text-[12px] font-medium text-yellow-700"
              aria-label={`작성자 ${author.name} 필터 해제`}
            >
              작성자: {author.name}
              <span aria-hidden>✕</span>
            </button>
          )}
        </div>

        {/* 목록 */}
        <div className="mt-3 min-h-0 flex-1 overflow-y-auto [scrollbar-color:var(--color-gray-300)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[scrollbar-color:var(--color-gray-600)_transparent] dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
          {isCommentsLoading ? (
            <p className="py-16 text-center text-[13px] font-medium text-gray-400">
              불러오는 중
            </p>
          ) : isError ? (
            <p className="py-16 text-center text-[13px] font-medium text-red-500">
              댓글 목록을 불러오지 못했습니다.
            </p>
          ) : comments.length === 0 ? (
            <p className="py-16 text-center text-[13px] font-medium text-gray-400">
              댓글이 없습니다.
            </p>
          ) : (
            <ul
              className={`flex flex-col gap-2.5 pb-4 transition-opacity ${
                isPlaceholderData ? "opacity-60" : ""
              }`}
            >
              {comments.map((comment) => (
                <CommentRow
                  key={comment.id}
                  comment={comment}
                  projectName={projectNameMap.get(comment.projectId)}
                  isPending={pendingIds.includes(comment.id)}
                  onSelectAuthor={() => {
                    setAuthor({
                      userId: comment.userId,
                      name: comment.authorName,
                    });
                    setPage(1);
                  }}
                  onSelectProject={() => {
                    setProjectId(comment.projectId);
                    setPage(1);
                  }}
                  onHide={() => hideMutation.mutate(comment.id)}
                  onUnhide={() => unhideMutation.mutate(comment.id)}
                  onDelete={() => setDeleteTarget(comment)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalElements > 0 && (
          <div className="flex shrink-0 items-center justify-center gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="h-8 cursor-pointer rounded-[8px] border border-gray-300 px-3 text-[12px] font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              이전
            </button>
            <span className="text-[13px] tabular-nums text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.hasNext || isPlaceholderData}
              className="h-8 cursor-pointer rounded-[8px] border border-gray-300 px-3 text-[12px] font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>
        )}
      </div>

      {deleteTarget && (
        <DeleteCommentConfirmModal
          comment={deleteTarget}
          isPending={deleteMutation.isPending}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
