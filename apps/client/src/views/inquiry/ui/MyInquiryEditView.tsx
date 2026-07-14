"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Chevron,
  Input,
  Textarea,
  Markdown,
  File as FileIcon,
  Upload,
  Close,
} from "@repo/ui";
import { useGetMyInquiryDetail, useUpdateInquiry } from "@/entities/inquiry";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 1000;

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

interface MyInquiryEditViewProps {
  inquiryId: number;
}

export default function MyInquiryEditView({
  inquiryId,
}: MyInquiryEditViewProps) {
  const router = useRouter();
  const { data, isPending: isLoading, isError } =
    useGetMyInquiryDetail(inquiryId);
  const { mutate, isPending } = useUpdateInquiry();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 상세 데이터를 처음 불러온 시점에 폼 초기값을 채운다.
  if (data && !isInitialized) {
    setTitle(data.title);
    setContent(data.content);
    setIsInitialized(true);
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE) {
      toast.error("파일 용량이 커서 업로드할 수 없습니다. (최대 10MB)");
      e.target.value = "";
      return;
    }
    setFile(selected);
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (isPending) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }

    mutate(
      {
        inquiryId,
        title: trimmedTitle,
        content: trimmedContent,
        // 새로 고른 파일이 없으면 undefined로 보내 기존 첨부파일을 유지한다.
        file: file ?? undefined,
      },
      {
        onSuccess: () => {
          router.push(`/inquiry/my/${inquiryId}`);
        },
      },
    );
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[600px]">
        {/* 상단 이동 */}
        <button
          type="button"
          onClick={() => router.push(`/inquiry/my/${inquiryId}`)}
          className="group -ml-1 flex items-center gap-1 text-[13px] font-medium text-gray-400 transition-colors hover:text-gray-600"
        >
          <Chevron
            direction="left"
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          />
          문의 상세
        </button>

        {isLoading ? (
          <p className="py-16 text-center text-[13px] font-medium text-gray-400">
            불러오는 중
          </p>
        ) : isError || !data ? (
          <p className="py-16 text-center text-[13px] font-medium text-red-500">
            문의 내용을 불러오지 못했습니다.
          </p>
        ) : data.status !== "PENDING" ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-center text-[13px] font-medium text-gray-500">
              답변이 완료된 문의는 수정할 수 없습니다.
            </p>
            <button
              type="button"
              onClick={() => router.push(`/inquiry/my/${inquiryId}`)}
              className="h-10 cursor-pointer rounded-[10px] bg-yellow-600 px-5 text-[13px] font-semibold text-gray-900 transition-all hover:bg-yellow-400 active:scale-[0.98]"
            >
              상세로 돌아가기
            </button>
          </div>
        ) : (
          <>
            {/* 헤더 */}
            <div className="mt-2.5 border-b border-gray-200 pb-4">
              <h1 className="text-[19px] font-semibold tracking-[-0.3px] text-gray-900">
                문의 수정하기
              </h1>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                등록한 문의 내용을 수정할 수 있습니다.
              </p>
            </div>

            {/* 폼 */}
            <div className="mt-5 flex flex-col gap-4">
              {/* 제목 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-medium text-gray-700">
                    제목
                  </label>
                  <span
                    className={`text-[11px] font-medium ${
                      title.length >= MAX_TITLE_LENGTH
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {title.length}/{MAX_TITLE_LENGTH}
                  </span>
                </div>
                <Input
                  title="제목을 입력하세요"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))
                  }
                  maxLength={MAX_TITLE_LENGTH}
                />
              </div>

              {/* 내용 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsPreview(false)}
                      className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${
                        !isPreview
                          ? "bg-yellow-600 text-gray-900"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      작성
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPreview(true)}
                      className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${
                        isPreview
                          ? "bg-yellow-600 text-gray-900"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      미리보기
                    </button>
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      content.length >= MAX_CONTENT_LENGTH
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {content.length}/{MAX_CONTENT_LENGTH}
                  </span>
                </div>
                {isPreview ? (
                  <div className="min-h-[144px] rounded-[10px] border border-gray-200 bg-white px-3.5 py-3">
                    {content.trim() ? (
                      <Markdown content={content} />
                    ) : (
                      <p className="text-[13px] text-gray-400">
                        미리볼 내용이 없습니다.
                      </p>
                    )}
                  </div>
                ) : (
                  <Textarea
                    title="문의 내용을 자세히 입력해주세요 (마크다운 문법 지원)"
                    value={content}
                    onChange={(e) =>
                      setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))
                    }
                    rows={6}
                    maxLength={MAX_CONTENT_LENGTH}
                  />
                )}
              </div>

              {/* 첨부파일 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-700">
                  첨부파일
                  <span className="ml-1 text-[12px] font-normal text-gray-400">
                    (선택)
                  </span>
                </label>
                {/* 기존 첨부파일 안내 (새 파일을 고르지 않은 경우) */}
                {!file && data.filePath && (
                  <p className="text-[12px] text-gray-500">
                    기존 첨부파일:{" "}
                    <span className="font-medium text-gray-700">
                      {data.originalFileName ??
                        data.filePath.split("/").pop() ??
                        "첨부파일"}
                    </span>
                  </p>
                )}
                {file ? (
                  <div className="flex items-center justify-between gap-3 rounded-[10px] border border-gray-200 bg-white px-3.5 py-2.5">
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                      <FileIcon className="h-[18px] w-[15px] shrink-0" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[13px] font-medium text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      disabled={isPending}
                      aria-label="첨부파일 제거"
                      className="shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Close width={13} height={13} />
                    </button>
                  </div>
                ) : (
                  <label
                    className={`group flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-dashed border-gray-300 bg-white py-3.5 transition-colors ${
                      isPending
                        ? "pointer-events-none opacity-50"
                        : "hover:border-yellow-600 hover:bg-yellow-50"
                    }`}
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isPending}
                    />
                    <Upload className="h-4 w-4 text-gray-400 transition-colors group-hover:text-yellow-700" />
                    <span className="text-[12px] font-medium text-gray-500 transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-200">
                      {data.filePath
                        ? "클릭하여 새 파일로 교체 (최대 10MB)"
                        : "클릭하여 파일 첨부 (최대 10MB)"}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* 액션 */}
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => router.push(`/inquiry/my/${inquiryId}`)}
                className="h-10 cursor-pointer rounded-[10px] px-4 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="h-10 cursor-pointer rounded-[10px] bg-yellow-600 px-5 text-[13px] font-semibold text-gray-900 transition-all hover:bg-yellow-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:active:scale-100"
              >
                {isPending ? "수정 중..." : "수정 완료"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
