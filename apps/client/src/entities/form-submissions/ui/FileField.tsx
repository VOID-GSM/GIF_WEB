import { ChangeEvent } from "react";
import { toast } from "sonner";
import { Upload, File, Close } from "@repo/ui";
import { useDeleteFormUpload } from "../hooks/useDeleteFormUpload";
import { useDownloadFile } from "../hooks/useDownloadFile";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FileFieldProps {
  fieldId: number;
  file: { name: string; size: number } | null;
  filePath?: string;
  fileSize?: number;
  originalFileName?: string; // 서버에 저장된 파일의 원본 파일명
  readOnly?: boolean;
  submitId?: number; // 추가
  allowedExtensions?: string[]; // admin 이 지정한 허용 확장자(비어 있으면 제한 없음)
  onChange: (fieldId: number, file: File | null) => void;
}

// 파일명에서 소문자 확장자를 추출한다. 확장자가 없으면 빈 문자열.
const getExtension = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex === -1 ? "" : fileName.slice(dotIndex + 1).toLowerCase();
};

export default function FileField({
  fieldId,
  file,
  filePath,
  fileSize,
  originalFileName,
  readOnly = false,
  submitId,
  allowedExtensions,
  onChange,
}: FileFieldProps) {
  const { mutate: deleteUpload, isPending: isDeleting } = useDeleteFormUpload();
  const { mutate: download, isPending: isDownloading } = useDownloadFile();

  const handleDelete = () => {
    if (filePath && submitId) {
      deleteUpload(
        { fieldId, submitId }, // submitId 추가
        { onSuccess: () => onChange(fieldId, null) },
      );
    } else {
      onChange(fieldId, null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  // admin 이 확장자를 지정한 경우에만 제한한다.
  const extensions = (allowedExtensions ?? []).map((e) => e.toLowerCase());
  const hasExtensionLimit = extensions.length > 0;

  // 파일 선택 여부·수정 상태와 무관하게 항상 노출되는 허용 형식 안내.
  const formatHint = hasExtensionLimit ? (
    <span className="mt-2 block text-[12px] text-gray-400 font-regular">
      허용 형식: {extensions.join(", ")} (최대 10MB)
    </span>
  ) : null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (
      hasExtensionLimit &&
      !extensions.includes(getExtension(selected.name))
    ) {
      toast.error(
        `허용된 파일 형식이 아닙니다. (${extensions.join(", ")} 형식만 업로드 가능)`,
      );
      e.target.value = "";
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      toast.error("파일 용량이 커서 업로드할 수 없습니다. (최대 10MB)");
      e.target.value = "";
      return;
    }
    onChange(fieldId, selected);
  };

  if (file || filePath) {
    // 새로 선택한 파일 > 서버 원본 파일명 > 경로 마지막(UUID) 순으로 표시
    const fileName =
      file?.name ?? originalFileName ?? filePath?.split("/").pop() ?? "첨부파일";
    const size = file?.size ?? fileSize ?? 0;

    return (
      <div>
        <div
          className={`flex items-center justify-between gap-3 rounded-[10px] border border-gray-80 pl-[24px] pr-[30px] py-[15px] ${
            filePath ? "cursor-pointer" : ""
          }`}
          onClick={() => {
            if (filePath && !isDownloading) {
              download({ fileUrl: filePath, fileName });
            }
          }}
        >
          <div className="flex gap-[22px] min-w-0 flex-1 items-center">
            <span className="flex-shrink-0">
              <File />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-semibold truncate text-gray-900">
                {fileName}
              </span>
              <span className="text-[11px] text-gray-400">
                {formatFileSize(size)}
              </span>
            </div>
          </div>

          {!readOnly && (
            <Close
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                if (!isDeleting) handleDelete();
              }}
              width={15}
              height={15}
              className="flex-shrink-0 text-gray-40 hover:opacity-60 transition-colors cursor-pointer"
            />
          )}
        </div>
        {!readOnly && formatHint}
      </div>
    );
  }

  if (readOnly) {
    return (
      <div className="flex items-center justify-center w-full border border-gray-80 rounded-[10px] py-[30px]">
        <span className="text-gray-400 text-[13px]">업로드된 파일 없음</span>
      </div>
    );
  }

  return (
    <div>
      <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-600 bg-gray-100 rounded-[10px] cursor-pointer hover:border-gray-600/60 hover:bg-gray-100/60 transition-colors">
        <input
          type="file"
          className="hidden"
          accept={
            hasExtensionLimit
              ? extensions.map((ext) => `.${ext}`).join(",")
              : undefined
          }
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center gap-3 my-[30px]">
          <Upload className="text-gray-50" />
          <span className="text-gray-50 font-regular">
            클릭하거나 파일을 드래그하여 업로드
          </span>
          {hasExtensionLimit && (
            <span className="text-[12px] text-gray-400 font-regular">
              허용 형식: {extensions.join(", ")}
            </span>
          )}
        </div>
      </label>
      {formatHint}
    </div>
  );
}
