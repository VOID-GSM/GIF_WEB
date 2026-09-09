import type { RelatedWork } from "@/entities/retrospective";

interface RelatedWorkCardProps {
  work: RelatedWork;
  /** 있으면 삭제 버튼을 보여준다 (작성 폼용). 없으면 읽기 전용 카드가 된다 (상세 화면용). */
  onRemove?: (id: number) => void;
}

export default function RelatedWorkCard({
  work,
  onRemove,
}: RelatedWorkCardProps) {
  const badgeColor =
    work.type === "PR"
      ? "bg-purple-50 text-purple-700"
      : "bg-blue-50 text-blue-700";

  const info = (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <span
          className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeColor}`}
        >
          #{work.number} {work.type === "PR" ? "PR" : "Issue"}
        </span>
        {work.url && (
          <span className="text-[11px] text-gray-400" aria-hidden="true">
            ↗
          </span>
        )}
      </div>
      <p className="line-clamp-2 text-[13px] font-semibold text-gray-900">
        {work.title}
      </p>
    </div>
  );

  return (
    <div className="flex items-start justify-between gap-2 rounded-[10px] border border-gray-200 bg-white p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm">
      {work.url ? (
        <a
          href={work.url}
          target="_blank"
          rel="noreferrer noopener"
          title="GitHub에서 열기"
          className="min-w-0 rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
        >
          {info}
        </a>
      ) : (
        info
      )}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(work.id)}
          aria-label={`#${work.number} ${work.title} 삭제`}
          className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-yellow-600"
        >
          ×
        </button>
      )}
    </div>
  );
}
