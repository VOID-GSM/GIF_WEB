"use client";

import { useEffect, useRef, useState } from "react";

import type { TermsSection } from "../model/terms";

interface TermsAgreementProps {
  terms: TermsSection[];
  /** 필수 약관이 모두 동의됐는지 여부를 부모에 알린다. */
  onRequiredAgreedChange: (agreed: boolean) => void;
}

export default function TermsAgreement({
  terms,
  onRequiredAgreedChange,
}: TermsAgreementProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const allChecked = terms.every((term) => checked[term.id]);
  const requiredAgreed = terms
    .filter((term) => term.required)
    .every((term) => checked[term.id]);

  // 부모가 인라인 콜백을 전달해도 무한 루프가 발생하지 않도록 최신 Ref 패턴을 적용한다.
  const onRequiredAgreedChangeRef = useRef(onRequiredAgreedChange);
  useEffect(() => {
    onRequiredAgreedChangeRef.current = onRequiredAgreedChange;
  });

  useEffect(() => {
    onRequiredAgreedChangeRef.current(requiredAgreed);
  }, [requiredAgreed]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleAll = () => {
    const next = !allChecked;
    setChecked(
      terms.reduce<Record<string, boolean>>((acc, term) => {
        acc[term.id] = next;
        return acc;
      }, {}),
    );
  };

  return (
    <div className="flex flex-col gap-[14px] w-full">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={toggleAll}
          className="w-[14px] h-[14px] accent-[#ffee30]"
        />
        <span className="text-[12px] font-medium text-black">전체 동의</span>
      </label>

      <div className="h-px w-full bg-gray-200" />

      <div className="flex flex-col gap-3">
        {terms.map((term) => (
          <div key={term.id} className="flex flex-col gap-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!checked[term.id]}
                onChange={() => toggle(term.id)}
                className="w-[14px] h-[14px] accent-[#ffee30]"
              />
              <span className="text-[12px] text-black">
                {term.title}{" "}
                <span className="text-gray-500">
                  ({term.required ? "필수" : "선택"})
                </span>
              </span>
            </label>
            <div className="max-h-[120px] overflow-y-auto rounded border border-gray-200 p-2 text-[10px] leading-[15px] text-gray-600 whitespace-pre-line">
              {term.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
