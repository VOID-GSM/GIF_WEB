"use client";
import { useState } from "react";
import { Close, Color } from "@repo/ui";
import {
  PRESET_COLOR_MAP,
  resolveColor,
  type PresetColorKey,
} from "../model/type";

function formatMonthDay(dateStr: string) {
  const [, month, day] = dateStr.split("-");
  return `${Number(month)}/${Number(day)}`;
}

// PRESET_COLOR_MAP 키 배열 — 색상 선택 UI에 사용
const PRESET_COLOR_KEYS = Object.keys(PRESET_COLOR_MAP) as PresetColorKey[];

interface EventFormModalProps {
  startDate: string;
  endDate: string;
  initialTitle?: string;
  initialColor?: string;
  submitLabel: string;
  showCancel?: boolean;
  onSubmit: (title: string, color: string) => void;
  onCancel?: () => void;
  onClose: () => void;
}

export default function EventFormModal({
  startDate,
  endDate,
  initialTitle,
  initialColor,
  submitLabel,
  showCancel = false,
  onSubmit,
  onCancel,
  onClose,
}: EventFormModalProps) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [color, setColor] = useState<PresetColorKey>(
    (initialColor as PresetColorKey) ?? "blue",
  );
  const isSameDay = startDate === endDate;
  const colorVar = resolveColor(color);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="relative w-[336px] bg-white rounded-[10px] overflow-hidden shadow-new"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-[38px] pb-6 flex flex-col gap-4">
          <Close
            className="absolute top-3 right-3 text-black cursor-pointer"
            width={10}
            height={10}
            onClick={onClose}
          />

          <div>
            {/* 색상 선택 — PRESET_COLOR_MAP 키 기반 */}
            <div className="flex gap-[15px] flex-wrap items-center h-[30px] mb-2">
              {PRESET_COLOR_KEYS.map((key) => {
                const isSelected = color === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setColor(key)}
                    className="w-6 h-6 rounded-full transition"
                    style={{
                      backgroundColor: resolveColor(key),
                      outline: isSelected
                        ? "2px solid var(--color-gray-500)"
                        : "2px solid transparent",
                      outlineOffset: isSelected ? "3px" : "0px",
                    }}
                  />
                );
              })}
              <Color />
            </div>

            <input
              type="text"
              placeholder="일정을 입력해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-500 rounded-[4px] px-3 py-2 mb-1 text-[12px] font-regular outline-none placeholder:text-gray-500"
            />

            <div className="text-[10px] text-gray-500 font-regular text-right">
              {isSameDay
                ? `날짜: ${formatMonthDay(startDate)}`
                : `기간: ${formatMonthDay(startDate)} ~ ${formatMonthDay(endDate)}`}
            </div>
          </div>

          <div className="flex gap-2">
            {showCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 items-center py-[7px] rounded-[4px] text-[12px] font-semibold border border-yellow-600 text-gray-500"
              >
                취소
              </button>
            )}
            <button
              type="button"
              disabled={!title.trim()}
              onClick={() => title.trim() && onSubmit(title.trim(), color)}
              className="flex-1 items-center py-[7px] rounded-[4px] text-[12px] bg-yellow-600 font-semibold text-black cursor-pointer transition-opacity disabled:opacity-40"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
