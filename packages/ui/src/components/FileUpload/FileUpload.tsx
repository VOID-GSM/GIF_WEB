"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";

import Close from "../../svg/Close";
import DashedBorder from "../../svg/DashedBorder";
import Upload from "../../svg/Upload";

interface FileUploadProps {
  onChange?: (file: File | null) => void;
  className?: string;
}

export default function FileUpload({ onChange, className = "" }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const applyFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    onChange?.(file);
  };

  const handleRemove = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange?.(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  };

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg ${className}`}>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex h-full w-full flex-col items-center justify-center gap-4 bg-gray-100 transition-colors ${
          isDragging ? "text-gray-300 bg-gray-50" : "text-gray-600 hover:text-gray-500"
        }`}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="thumbnail preview"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <>
            <DashedBorder />
            <Upload width={98} height={39} />
            <span>파일 업로드</span>
          </>
        )}
      </button>

      {previewUrl && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 z-10 grid size-6 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <Close />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}