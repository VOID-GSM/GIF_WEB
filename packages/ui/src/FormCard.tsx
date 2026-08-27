"use client";

import { useRef, useState } from "react";
import Close from "./svg/Close";
import DragHandle from "./svg/DragHandle";
import Input from "./components/Input/Input";
import Textarea from "./components/Input/Textarea";
import StyleDropdown from "./components/Dropdown/StyleDropdown";
import type { StyleOption } from "./components/Dropdown/StyleDropdown";

interface PostFormRequestField {
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "CALENDAR" | "";
  orderIndex: number;
  /** 학생이 반드시 답변해야 하는 항목인지 여부 (false면 비워둔 채 제출 가능) */
  required: boolean;
  allowedExtensions?: string[]; // FILE 타입에서 client 가 제출 가능한 확장자
}

export interface PostFormRequest {
  title: string;
  description: string;
  deadline: string;
  targetGrade: number;
  fields: PostFormRequestField[];
}

const STYLE_TO_TYPE: Record<StyleOption, "TEXT" | "FILE" | "CALENDAR"> = {
  file: "FILE",
  text: "TEXT",
  calendar: "CALENDAR",
};

const TYPE_TO_STYLE: Record<string, StyleOption | null> = {
  TEXT: "text",
  FILE: "file",
  CALENDAR: "calendar",
  "": null,
};

const STYLE_LABEL: Record<StyleOption, string> = {
  file: "파일",
  text: "줄 글 텍스트",
  calendar: "캘린더",
};

// FILE 타입에서 admin 이 허용할 수 있는 제출 파일 확장자 목록
const ALLOWED_EXTENSION_OPTIONS = [
  "pdf",
  "hwp",
  "hwpx",
  "docx",
  "pptx",
  "xlsx",
  "png",
  "jpg",
  "zip",
] as const;

const TITLE_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 200;

interface FormCardProps {
  field: PostFormRequestField & { id: string };
  onChange: (id: string, updated: Partial<PostFormRequestField>) => void;
  onDelete: (id: string) => void;
  // 순서 변경(드래그) — 정렬을 지원하는 화면에서만 전달한다. 없으면 핸들이 렌더되지 않는다.
  onDragStart?: (id: string) => void;
  onDragEnter?: (id: string) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}

export default function FormCard({
  field,
  onChange,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDragging = false,
}: FormCardProps) {
  const selectedStyle =
    field.type === "" ? null : (TYPE_TO_STYLE[field.type] ?? null);

  const isReorderable = !!onDragStart;
  // 카드 전체를 draggable 로 두면 입력창 안에서 텍스트를 끌 때도 드래그가 시작된다.
  // 핸들을 누르고 있는 동안에만 draggable 을 켜 입력 조작과 충돌하지 않게 한다.
  const [isHandleHeld, setIsHandleHeld] = useState(false);

  // 한글(IME) 조합 중에는 값을 자르지 않는다 — 조합 도중 value를 강제로 잘라내면
  // 브라우저의 composition 세션이 깨져 마지막 글자가 누락되거나 조합이 끊길 수 있다.
  const isTitleComposing = useRef(false);
  const isDescriptionComposing = useRef(false);

  const handleStyleChange = (style: StyleOption) => {
    onChange(field.id, {
      type: STYLE_TO_TYPE[style],
    });
  };

  const toggleExtension = (ext: string) => {
    const current = field.allowedExtensions ?? [];
    const next = current.includes(ext)
      ? current.filter((e) => e !== ext)
      : [...current, ext];
    onChange(field.id, { allowedExtensions: next });
  };

  const toggleRequired = () => {
    onChange(field.id, { required: !field.required });
  };

  return (
    <div
      draggable={isHandleHeld}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(field.id);
      }}
      onDragEnter={() => onDragEnter?.(field.id)}
      onDragOver={(e) => {
        // preventDefault 를 해야 드롭 대상으로 인식된다.
        if (isReorderable) e.preventDefault();
      }}
      onDrop={(e) => e.preventDefault()}
      onDragEnd={() => {
        setIsHandleHeld(false);
        onDragEnd?.();
      }}
      className={`flex flex-col justify-center w-full shadow-new border-t-[5px] border-t-yellow-600 rounded-[10px] bg-white p-4 pt-9 transition-opacity ${
        isDragging ? "opacity-40" : "opacity-100"
      }`}
    >
      {isReorderable && (
        <div className="flex justify-center -mt-6 mb-1">
          <button
            type="button"
            aria-label="항목 순서 변경"
            title="드래그해서 순서를 바꿀 수 있습니다"
            onMouseDown={() => setIsHandleHeld(true)}
            onMouseUp={() => setIsHandleHeld(false)}
            className="px-3 py-1 text-gray-300 transition-colors hover:text-gray-500 cursor-grab active:cursor-grabbing"
          >
            <DragHandle width={20} height={12} />
          </button>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 px-8">
          <Input
            value={field.title}
            onChange={(e) => {
              const value = e.target.value;
              onChange(field.id, {
                title: isTitleComposing.current
                  ? value
                  : value.slice(0, TITLE_MAX_LENGTH),
              });
            }}
            onCompositionStart={() => {
              isTitleComposing.current = true;
            }}
            onCompositionEnd={(e) => {
              isTitleComposing.current = false;
              onChange(field.id, {
                title: e.currentTarget.value.slice(0, TITLE_MAX_LENGTH),
              });
            }}
            maxLength={TITLE_MAX_LENGTH}
          />
          <span className="self-end text-xs text-gray-400">
            {field.title.length}/{TITLE_MAX_LENGTH}
          </span>
          <Textarea
            value={field.description}
            onChange={(e) => {
              const value = e.target.value;
              onChange(field.id, {
                description: isDescriptionComposing.current
                  ? value
                  : value.slice(0, DESCRIPTION_MAX_LENGTH),
              });
            }}
            onCompositionStart={() => {
              isDescriptionComposing.current = true;
            }}
            onCompositionEnd={(e) => {
              isDescriptionComposing.current = false;
              onChange(field.id, {
                description: e.currentTarget.value.slice(
                  0,
                  DESCRIPTION_MAX_LENGTH,
                ),
              });
            }}
            maxLength={DESCRIPTION_MAX_LENGTH}
          />
          <span className="self-end text-xs text-gray-400">
            {field.description.length}/{DESCRIPTION_MAX_LENGTH}
          </span>
          <StyleDropdown value={selectedStyle} onChange={handleStyleChange} />
          {selectedStyle && (
            <div className="px-4 py-[14px] border-b border-gray-200 text-gray-500">
              <span>{STYLE_LABEL[selectedStyle]}</span>
            </div>
          )}
          {selectedStyle === "file" && (
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[13px] font-medium text-gray-500">
                허용 파일 형식
              </span>
              <div className="flex flex-wrap gap-2">
                {ALLOWED_EXTENSION_OPTIONS.map((ext) => {
                  const selected = (field.allowedExtensions ?? []).includes(ext);
                  return (
                    <button
                      key={ext}
                      type="button"
                      onClick={() => toggleExtension(ext)}
                      className={`px-3 py-1.5 rounded-full text-[13px] border transition-colors cursor-pointer ${
                        selected
                          ? "border-yellow-600 bg-yellow-600/10 text-gray-900 dark:bg-yellow-500/15"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {ext}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-gray-500">
                필수 항목
              </span>
              <span className="text-[12px] text-gray-400">
                {field.required
                  ? "학생이 반드시 답변해야 합니다."
                  : "학생이 비워둔 채 제출할 수 있습니다."}
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={field.required}
              aria-label="필수 항목 여부"
              onClick={toggleRequired}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer ${
                field.required ? "bg-yellow-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  field.required ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <Close
            width={10}
            className="cursor-pointer"
            onClick={() => onDelete(field.id)}
          />
        </div>
      </div>
    </div>
  );
}
