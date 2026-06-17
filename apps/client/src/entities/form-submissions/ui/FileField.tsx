import { Upload, File, Close } from "@repo/ui";
import { usePostFormUpload } from "../hooks/usePostFormUpload";
import { useDeleteFormUpload } from "../hooks/useDeleteFormUpload";

interface FileFieldProps {
  fieldId: number;
  file: File | null;
  readOnly?: boolean;
  onChange: (fieldId: number, file: File | null) => void;
}

export default function FileField({
  fieldId,
  file,
  readOnly = false,
  onChange,
}: FileFieldProps) {
  const { mutate: upload, isPending: isUploading } = usePostFormUpload();
  const { mutate: deleteUpload, isPending: isDeleting } = useDeleteFormUpload();

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const formData = new FormData();
    formData.append("file", selected);
    upload(formData, {
      onSuccess: () => onChange(fieldId, selected),
    });
  };

  const handleDelete = () => {
    deleteUpload({ fieldId }, { onSuccess: () => onChange(fieldId, null) });
  };

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-[10px] border border-gray-80 pl-[24px] pr-[30px] py-[15px]">
        <div className="flex gap-[22px]">
          <File />
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold">{file.name}</span>
            <span className="text-[11px] text-gray-400">
              {formatFileSize(file.size)}
            </span>
          </div>
        </div>

        {!readOnly && (
          <Close
            onClick={isDeleting ? undefined : handleDelete}
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
      <input
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <div className="flex flex-col items-center gap-6 my-[30px]">
        <Upload
          className={
            isUploading ? "text-gray-30 animate-pulse" : "text-gray-50"
          }
        />
        <span className="text-gray-50 font-regular">
          {isUploading ? "업로드 중..." : "클릭하거나 파일을 드래그하여 업로드"}
        </span>
      </div>
    </label>
  );
}
