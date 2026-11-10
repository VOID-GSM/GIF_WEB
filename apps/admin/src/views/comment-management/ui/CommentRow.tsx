import type { AdminComment } from "@/entities/comment";

interface Props {
  comment: AdminComment;
  projectName?: string;
  isPending: boolean;
  onSelectAuthor: () => void;
  onSelectProject: () => void;
  onHide: () => void;
  onUnhide: () => void;
  onDelete: () => void;
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Seoul",
});

const ACTION_BUTTON_CLASS =
  "h-8 cursor-pointer rounded-[8px] border px-3 text-[12px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export default function CommentRow({
  comment,
  projectName,
  isPending,
  onSelectAuthor,
  onSelectProject,
  onHide,
  onUnhide,
  onDelete,
}: Props) {
  return (
    <li
      className={`flex w-full flex-col gap-2 rounded-[12px] border px-4 py-3.5 ${
        comment.hidden
          ? "border-gray-200 bg-gray-50 dark:bg-gray-900"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]">
        <button
          type="button"
          onClick={onSelectProject}
          className="cursor-pointer rounded-full border border-yellow-600 bg-yellow-50 px-2.5 py-0.5 font-medium text-yellow-700"
          title="이 프로젝트 댓글만 보기"
        >
          {projectName ?? `프로젝트 #${comment.projectId}`}
        </button>
        <button
          type="button"
          onClick={onSelectAuthor}
          className="cursor-pointer font-medium text-gray-800 underline-offset-2 hover:underline"
          title="이 작성자 댓글만 보기"
        >
          {comment.authorName}
        </button>
        <span className="text-gray-400">
          {dateFormatter.format(new Date(comment.createdAt))}
        </span>
        {comment.hidden && (
          <span className="rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
            숨김
          </span>
        )}
      </div>

      <p
        className={`whitespace-pre-wrap break-words text-[14px] leading-relaxed ${
          comment.hidden ? "text-gray-400" : "text-gray-800"
        }`}
      >
        {comment.content}
      </p>

      <div className="flex justify-end gap-2">
        {comment.hidden ? (
          <button
            type="button"
            onClick={onUnhide}
            disabled={isPending}
            className={`${ACTION_BUTTON_CLASS} border-gray-300 text-gray-700 hover:bg-gray-50`}
          >
            숨김 해제
          </button>
        ) : (
          <button
            type="button"
            onClick={onHide}
            disabled={isPending}
            className={`${ACTION_BUTTON_CLASS} border-gray-300 text-gray-700 hover:bg-gray-50`}
          >
            숨기기
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          disabled={isPending}
          className={`${ACTION_BUTTON_CLASS} border-red-300 text-red-500 hover:bg-red-50`}
        >
          삭제
        </button>
      </div>
    </li>
  );
}
