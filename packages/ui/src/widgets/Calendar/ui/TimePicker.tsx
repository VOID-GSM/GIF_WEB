"use client";
import { useEffect, useRef, useState } from "react";
import type { TimePickerProps } from "../model/type";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 바깥 영역 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const [hour = "", minute = ""] = value ? value.split(":") : [];

  const select = (nextHour: string, nextMinute: string) => {
    onChange(`${nextHour}:${nextMinute}`);
  };

  const handleHour = (h: string) => select(h, minute || "00");
  const handleMinute = (m: string) => select(hour || "00", m);

  return (
    <div className="relative w-full" ref={rootRef}>
      <div
        className="w-full flex items-center justify-between py-3 px-4 border border-gray-200 rounded-[10px] text-[18px] font-medium cursor-pointer outline-none bg-white"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span
          className={`whitespace-nowrap ${value ? "text-black" : "text-gray-500"}`}
        >
          {value || "시간 선택"}
        </span>
      </div>

      {/* 시/분 선택 */}
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-10 w-full bg-white border border-gray-200 rounded-[10px] p-4 shadow-new">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}
          >
            {/* 시 */}
            <div className="max-h-[264px] overflow-y-auto flex flex-col gap-[2px] pr-1">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleHour(h)}
                  className={`text-center text-[14px] py-[7px] rounded-[8px] transition-colors ${
                    hour === h
                      ? "bg-yellow-600 text-white font-medium"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            {/* 분 */}
            <div className="max-h-[264px] overflow-y-auto flex flex-col gap-[2px] pr-1">
              {MINUTES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMinute(m)}
                  className={`text-center text-[14px] py-[7px] rounded-[8px] transition-colors ${
                    minute === m
                      ? "bg-yellow-600 text-white font-medium"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
