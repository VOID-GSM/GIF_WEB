"use client";

import { useEffect, useRef, useState } from "react";

import { Chevron } from "@repo/ui";

import { ROLES, type AdminRole } from "@/entities/signup";

interface RoleSelectProps {
  value: AdminRole | null;
  onChange: (role: AdminRole) => void;
}

export default function RoleSelect({ value, onChange }: RoleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = ROLES.find((role) => role.value === value)?.label;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-7 px-[10px] flex items-center justify-between rounded bg-white text-[12px] border transition-colors ${
          value ? "border-black text-black" : "border-gray-500 text-gray-500"
        }`}
      >
        <span>{selectedLabel ?? "역할을 선택해 주세요"}</span>
        <Chevron
          direction={isOpen ? "up" : "down"}
          width={12}
          height={6}
          className={value ? "text-black" : "text-gray-500"}
        />
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 right-0 mt-0.5 bg-white border border-gray-300 rounded shadow-sm z-10">
          {ROLES.map((role) => (
            <li key={role.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(role.value);
                  setIsOpen(false);
                }}
                className="w-full px-[10px] py-2 text-left text-[12px] text-black hover:bg-gray-100"
              >
                {role.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
