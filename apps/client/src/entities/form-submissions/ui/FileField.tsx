import { ChangeEvent } from "react";
import { Upload, File, Close } from "@repo/ui";
import { useDeleteFormUpload } from "../hooks/useDeleteFormUpload";
import { useDownloadFile } from "../hooks/useDownloadFile";

interface FileFieldProps {
  fieldId: number;
  file: { name: string; size: number } | null;
  filePath?: string;
  fileSize?: number;
  readOnly?: boolean;
  submitId?: number; // 추가
  onChange: (fieldId: number, file: File | null) => void;
}

export default function FileField({
  fieldId,
  file,
  filePath,
  fileSize,
  readOnly = false,
  submitId,
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    onChange(fieldId, selected);
  };

  if (file || filePath) {
    const fileName = file?.name ?? filePath?.split("/").pop() ?? "첨부파일";
    const size = file?.size ?? fileSize ?? 0;

    return (
      <div
        className={`flex items-center justify-between rounded-[10px] border border-gray-80 pl-[24px] pr-[30px] py-[15px] ${
          filePath ? "cursor-pointer" : ""
        }`}
        onClick={() => {
          if (filePath && !isDownloading) {
            download({ fileUrl: filePath, fileName });
          }
        }}
      >
        <div className="flex gap-[22px]">
          <File />
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold">{fileName}</span>
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
            className="text-gray-40 hover:text-gray-40/60 transition-colors cursor-pointer"
          />
        )}
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
    <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-600 bg-gray-100 rounded-[10px] cursor-pointer hover:border-gray-600/60 hover:bg-gray-100/60 transition-colors">
      <input type="file" className="hidden" onChange={handleFileChange} />
      <div className="flex flex-col items-center gap-6 my-[30px]">
        <Upload className="text-gray-50" />
        <span className="text-gray-50 font-regular">
          클릭하거나 파일을 드래그하여 업로드
        </span>
      </div>
    </label>
  );
}
