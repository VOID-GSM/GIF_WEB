"use client";

import { POSITIONS, type ClientRole } from "@/entities/signup";

interface PositionSelectProps {
  value: ClientRole | null;
  onChange: (value: ClientRole) => void;
}

export default function PositionSelect({ value, onChange }: PositionSelectProps) {
  return (
    <div className="flex gap-[10px] w-full">
      {POSITIONS.map((position) => {
        const isSelected = value === position.value;
        return (
          <button
            key={position.value}
            type="button"
            onClick={() => onChange(position.value)}
            className={`flex-1 h-7 rounded text-[12px] border transition-colors ${
              isSelected
                ? "bg-yellow-50 border-yellow-600 text-yellow-600"
                : "bg-white border-gray-500 text-gray-500"
            }`}
          >
            {position.label}
          </button>
        );
      })}
    </div>
  );
}
