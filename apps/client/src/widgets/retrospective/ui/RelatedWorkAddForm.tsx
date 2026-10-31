"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import type { RelatedWork, RelatedWorkType } from "@/entities/retrospective";
import {
  fetchGithubTitle,
  parseGithubUrl,
} from "@/entities/retrospective/lib/parseGithubUrl";
import CustomSelect from "@/shared/ui/CustomSelect";

const TYPE_OPTIONS: { value: RelatedWorkType; label: string }[] = [
  { value: "ISSUE", label: "Issue" },
  { value: "PR", label: "PR" },
];

interface RelatedWorkAddFormProps {
  onAdd: (work: RelatedWork) => void;
  onCancel: () => void;
}

export default function RelatedWorkAddForm({
  onAdd,
  onCancel,
}: RelatedWorkAddFormProps) {
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const [titleFetchFailed, setTitleFetchFailed] = useState(false);
  const [link, setLink] = useState("");
  const [type, setType] = useState<RelatedWorkType>("ISSUE");
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState<string | undefined>(undefined);
  const fetchRequestId = useRef(0);

  const handleLinkChange = async (value: string) => {
    setLink(value);
    setTitleFetchFailed(false);
    const parsed = parseGithubUrl(value);
    if (!parsed) {
      setUrl(undefined);
      return;
    }

    // GitHub 이슈·PR 링크 형식이면 유형·번호를 자동으로 채우고,
    // 공개 GitHub API로 제목까지 가져와본다 (비공개 저장소 등으로 실패하면
    // 직접 입력할 수 있게 안내만 띄운다).
    setType(parsed.type);
    setNumber(String(parsed.number));
    setUrl(value.trim());

    const requestId = ++fetchRequestId.current;
    setIsFetchingTitle(true);
    const fetchedTitle = await fetchGithubTitle(parsed);
    if (requestId !== fetchRequestId.current) return; // 이미 다른 입력으로 대체됨

    setIsFetchingTitle(false);
    if (fetchedTitle) {
      setTitle(fetchedTitle);
    } else {
      setTitleFetchFailed(true);
    }
  };

  const handleAdd = () => {
    const parsed = Number(number);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      toast.error("번호는 1 이상의 숫자로 입력해주세요.");
      return;
    }
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    onAdd({ id: Date.now(), type, number: parsed, title: title.trim(), url });
  };

  return (
    <div className="animate-fade-in-up flex flex-col gap-2 rounded-[10px] border border-gray-200 bg-gray-100 p-2.5 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <label htmlFor="related-work-link" className="sr-only">
          GitHub 이슈·PR 링크
        </label>
        <input
          id="related-work-link"
          type="text"
          inputMode="url"
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          value={link}
          onChange={(e) => void handleLinkChange(e.target.value)}
          placeholder="GitHub 이슈·PR 링크를 붙여넣으면 자동으로 채워져요 (선택)"
          className="w-full rounded-[8px] border border-gray-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-black outline-none placeholder:text-gray-400 focus:border-yellow-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
        />
        <p className="mt-1 text-[11px] text-gray-400">
          공개 저장소의 이슈·PR만 제목을 자동으로 가져올 수 있어요. 비공개
          저장소는 제목을 직접 입력해주세요.
        </p>
        {isFetchingTitle && (
          <p className="mt-1 text-[11px] text-gray-400" aria-live="polite">
            제목을 가져오는 중...
          </p>
        )}
        {titleFetchFailed && (
          <p className="mt-1 text-[11px] text-red-500" aria-live="polite">
            비공개 저장소이거나 찾을 수 없어 제목을 자동으로 가져오지 못했어요.
            제목을 직접 입력해주세요.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <label htmlFor="related-work-type" className="sr-only">
          작업 유형
        </label>
        <CustomSelect
          id="related-work-type"
          value={type}
          options={TYPE_OPTIONS}
          onChange={setType}
          ariaLabel="작업 유형"
          size="sm"
          className="w-[92px] shrink-0"
        />

        <label htmlFor="related-work-number" className="sr-only">
          번호
        </label>
        <input
          id="related-work-number"
          type="number"
          min={1}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="번호"
          className="w-[80px] shrink-0 rounded-[8px] border border-gray-200 bg-white px-2 py-1.5 text-[12px] font-medium text-black outline-none placeholder:text-gray-400 focus:border-yellow-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
        />

        <label htmlFor="related-work-title" className="sr-only">
          작업 제목
        </label>
        <input
          id="related-work-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 직접 입력해도 돼요"
          className="min-w-[140px] flex-1 rounded-[8px] border border-gray-200 bg-white px-2 py-1.5 text-[12px] font-medium text-black outline-none placeholder:text-gray-400 focus:border-yellow-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
        />

        <button
          type="button"
          onClick={handleAdd}
          className="cursor-pointer rounded-[8px] bg-yellow-600 px-3 py-1.5 text-[12px] font-medium text-gray-900 transition-colors hover:bg-yellow-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
        >
          추가
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-[8px] px-2 py-1.5 text-[12px] font-medium text-gray-500 transition-colors hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
        >
          취소
        </button>
      </div>
    </div>
  );
}
