"use client";

import { POSITIONS, type Position } from "@/entities/signup";

interface PositionSelectProps {
  value: Position | null;
  onChange: (position: Position) => void;
}

export default function PositionSelect({ value, onChange }: PositionSelectProps) {
  return (
    <div className="flex gap-[10px] w-full">
      {POSITIONS.map((position) => {
        const isSelected = value === position;
        return (
          <button
            key={position}
            type="button"
            onClick={() => onChange(position)}
            className={`flex-1 h-7 rounded text-[12px] border transition-colors ${
              isSelected
                ? "bg-yellow-50 border-yellow-600 text-yellow-600"
                : "bg-white border-gray-500 text-gray-500"
            }`}
          >
            {position}
          </button>
        );
      })}
    </div>
  );
}
