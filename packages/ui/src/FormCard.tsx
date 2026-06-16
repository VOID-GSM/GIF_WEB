"use client";

import Close from "./svg/Close";
import Input from "./components/Input/Input";
import Textarea from "./components/Input/Textarea";
import StyleDropdown from "./components/Dropdown/StyleDropdown";
import type { StyleOption } from "./components/Dropdown/StyleDropdown";

interface PostFormRequestField {
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "CALENDAR";
  orderIndex: number;
}

export interface PostFormRequest {
  title: string;
  description: string;
  deadline: string;
  targetGrade: number;
  fields: PostFormRequestField[];
}

const STYLE_TO_TYPE: Record<StyleOption, PostFormRequestField["type"]> = {
  file: "FILE",
  text: "TEXT",
  calendar: "CALENDAR",
};

const TYPE_TO_STYLE: Record<PostFormRequestField["type"], StyleOption> = {
  TEXT: "text",
  FILE: "file",
  CALENDAR: "calendar",
};

const STYLE_LABEL: Record<StyleOption, string> = {
  file: "파일",
  text: "줄 글 텍스트",
  calendar: "캘린더",
};

interface FormCardProps {
  field: PostFormRequestField & { id: string };
  onChange: (id: string, updated: Partial<PostFormRequestField>) => void;
  onDelete: (id: string) => void;
}

export default function FormCard({ field, onChange, onDelete }: FormCardProps) {
  const selectedStyle = TYPE_TO_STYLE[field.type];

  const handleStyleChange = (style: StyleOption) => {
    onChange(field.id, {
      type: STYLE_TO_TYPE[style],
    });
  };

  return (
    <div className="flex flex-col justify-center w-140 shadow-new border-t-[5px] border-t-yellow-600 rounded-[10px] bg-white p-4 pt-9">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 px-8">
          <Input
            value={field.title}
            onChange={(e) => onChange(field.id, { title: e.target.value })}
          />
          <Textarea
            value={field.description}
            onChange={(e) =>
              onChange(field.id, { description: e.target.value })
            }
          />
          <StyleDropdown onChange={handleStyleChange} />
          {selectedStyle && (
            <div className="px-4 py-[14px] border-b border-gray-200 text-gray-500">
              <span>{STYLE_LABEL[selectedStyle]}</span>
            </div>
          )}
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
