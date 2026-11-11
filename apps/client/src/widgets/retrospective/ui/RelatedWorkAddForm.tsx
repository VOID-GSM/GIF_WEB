"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("retrospective.relatedWork");
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const [titleFetchError, setTitleFetchError] = useState<
    "rate-limit" | "not-found" | null
  >(null);
  const [link, setLink] = useState("");
  const [type, setType] = useState<RelatedWorkType>("ISSUE");
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState<string | undefined>(undefined);
  const fetchRequestId = useRef(0);

  const handleLinkChange = async (value: string) => {
    setLink(value);
    setTitleFetchError(null);
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
    const result = await fetchGithubTitle(parsed);
    if (requestId !== fetchRequestId.current) return; // 이미 다른 입력으로 대체됨

    setIsFetchingTitle(false);
    if ("title" in result) {
      setTitle(result.title);
    } else {
      setTitleFetchError(result.error);
    }
  };

  // 링크로 채운 뒤 유형·번호를 직접 바꾸면 링크가 다른 이슈·PR을 가리키게 되므로 url을 비운다
  const handleTypeChange = (value: RelatedWorkType) => {
    setType(value);
    setUrl(undefined);
  };

  const handleNumberChange = (value: string) => {
    setNumber(value);
    setUrl(undefined);
  };

  const handleAdd = () => {
    const parsed = Number(number);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      toast.error(t("invalidNumber"));
      return;
    }
    if (!title.trim()) {
      toast.error(t("titleRequired"));
      return;
    }

    onAdd({ id: Date.now(), type, number: parsed, title: title.trim(), url });
  };

  return (
    <div className="animate-fade-in-up flex flex-col gap-2 rounded-[10px] border border-gray-200 bg-gray-100 p-2.5 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <label htmlFor="related-work-link" className="sr-only">
          {t("linkLabel")}
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
          placeholder={t("linkPlaceholder")}
          className="w-full rounded-[8px] border border-gray-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-black outline-none placeholder:text-gray-400 focus:border-yellow-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
        />
        <p className="mt-1 text-[11px] text-gray-400">
          {t("hint")}
        </p>
        {isFetchingTitle && (
          <p className="mt-1 text-[11px] text-gray-400" aria-live="polite">
            {t("fetching")}
          </p>
        )}
        {titleFetchError && (
          <p className="mt-1 text-[11px] text-red-500" aria-live="polite">
            {titleFetchError === "rate-limit"
              ? t("rateLimit")
              : t("notFound")}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <label htmlFor="related-work-type" className="sr-only">
          {t("type")}
        </label>
        <CustomSelect
          id="related-work-type"
          value={type}
          options={TYPE_OPTIONS}
          onChange={handleTypeChange}
          ariaLabel={t("type")}
          size="sm"
          className="w-[92px] shrink-0"
        />

        <label htmlFor="related-work-number" className="sr-only">
          {t("number")}
        </label>
        <input
          id="related-work-number"
          type="number"
          min={1}
          value={number}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder={t("number")}
          className="w-[80px] shrink-0 rounded-[8px] border border-gray-200 bg-white px-2 py-1.5 text-[12px] font-medium text-black outline-none placeholder:text-gray-400 focus:border-yellow-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
        />

        <label htmlFor="related-work-title" className="sr-only">
          {t("workTitle")}
        </label>
        <input
          id="related-work-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("titlePlaceholder")}
          className="min-w-[140px] flex-1 rounded-[8px] border border-gray-200 bg-white px-2 py-1.5 text-[12px] font-medium text-black outline-none placeholder:text-gray-400 focus:border-yellow-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
        />

        <button
          type="button"
          onClick={handleAdd}
          className="cursor-pointer rounded-[8px] bg-yellow-600 px-3 py-1.5 text-[12px] font-medium text-gray-900 transition-colors hover:bg-yellow-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
        >
          {t("add")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-[8px] px-2 py-1.5 text-[12px] font-medium text-gray-500 transition-colors hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
