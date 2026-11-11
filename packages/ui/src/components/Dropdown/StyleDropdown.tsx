"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Chevron } from "../..";

export type StyleOption = "file" | "text" | "calendar";

interface StyleDropdownProps {
  value?: StyleOption | null;
  onChange?: (option: StyleOption) => void;
}

const STYLE_OPTIONS: StyleOption[] = ["file", "text", "calendar"];

export default function StyleDropdown({ value, onChange }: StyleDropdownProps) {
  const t = useTranslations("styleDropdown");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: StyleOption) => {
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        className="w-full flex items-center justify-between py-[13px] px-[16px] bg-white border border-gray-200 rounded-xl font-medium cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-black" : "text-gray-500"}>
          {value ? t(value) : t("placeholder")}
        </span>
        <Chevron
          className={`transition-transform text-gray-500 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute top-full w-full bg-white rounded-[4px] overflow-hidden z-10 shadow-new">
          {STYLE_OPTIONS.map((key) => (
            <li key={key}>
              <button
                className="w-full text-left px-[10px] py-[12px] font-medium text-[12px] transition-colors hover:bg-gray-200 cursor-pointer dark:text-gray-300"
                onClick={() => handleSelect(key)}
              >
                {t(key)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
