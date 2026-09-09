"use client";

import { useState } from "react";

import type { RelatedWork } from "@/entities/retrospective";

import RelatedWorkAddForm from "./RelatedWorkAddForm";
import RelatedWorkCard from "./RelatedWorkCard";

interface RelatedWorkListProps {
  relatedWorks: RelatedWork[];
  onChange: (relatedWorks: RelatedWork[]) => void;
}

export default function RelatedWorkList({
  relatedWorks,
  onChange,
}: RelatedWorkListProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (work: RelatedWork) => {
    onChange([...relatedWorks, work]);
    setIsAdding(false);
  };

  const handleRemove = (id: number) => {
    onChange(relatedWorks.filter((work) => work.id !== id));
  };

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-[14px] font-semibold text-gray-900">관련 작업</h2>

      <ul className="flex flex-wrap gap-2">
        {relatedWorks.map((work) => (
          <li key={work.id} className="w-full sm:w-[260px]">
            <RelatedWorkCard work={work} onRemove={handleRemove} />
          </li>
        ))}

        {!isAdding && (
          <li className="w-full sm:w-[260px]">
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="flex h-full min-h-[76px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-gray-300 text-[12px] font-medium text-gray-500 transition-all duration-150 hover:border-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
            >
              + 추가
            </button>
          </li>
        )}
      </ul>

      {isAdding && (
        <RelatedWorkAddForm
          onAdd={handleAdd}
          onCancel={() => setIsAdding(false)}
        />
      )}
    </section>
  );
}
