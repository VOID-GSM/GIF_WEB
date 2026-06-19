"use client";
import { useState } from "react";
import { Chevron } from "../..";

type StyleOption = "file" | "text" | "calendar";

interface StyleDropdownProps {
  onChange?: (option: StyleOption) => void;
}

const STYLE_MAP: Record<StyleOption, string> = {
  file: "파일",
  text: "줄 글",
  calendar: "캘린더",
};

export default function StyleDropdown({ onChange }: StyleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<StyleOption | null>(null);

  const handleSelect = (option: StyleOption) => {
    setSelected(option);
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        className="w-full flex items-center justify-between py-[13px] px-[16px] bg-white border border-gray-200 rounded-xl font-medium cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selected ? "text-black" : "text-gray-500"}>
          {selected ? STYLE_MAP[selected] : "스타일을 선택하세요"}
        </span>
        <Chevron
          className={`transition-transform text-gray-500 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute top-full w-full bg-white rounded-[4px] overflow-hidden z-10 shadow-new">
          {Object.entries(STYLE_MAP).map(([key, label]) => (
            <li key={key}>
              <button
                className={`w-full text-left px-[10px] py-[12px] font-medium text-[12px] hover:bg-gray-200 cursor-pointer`}
                onClick={() => handleSelect(key as StyleOption)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
