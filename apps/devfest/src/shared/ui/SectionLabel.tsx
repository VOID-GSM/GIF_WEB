interface SectionLabelProps {
  children: React.ReactNode;
}

// 섹션 제목 — 노란 강조 바 + 제목 (메인 카드의 옐로우 톤과 통일)
export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-6 w-[6px] rounded-full bg-yellow-600" />
      <h2 className="text-[24px] font-bold tracking-[-0.5px] text-black">
        {children}
      </h2>
    </div>
  );
}
