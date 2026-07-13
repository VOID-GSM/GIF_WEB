interface SectionLabelProps {
  children: React.ReactNode;
}

// 섹션 제목 — 옐로우→오렌지 강조 바 + 제목 (브랜드 톤과 통일)
export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-6 w-[5px] rounded-full bg-gradient-to-b from-yellow-600 to-orange-400" />
      <h2 className="text-[24px] font-bold tracking-[-0.6px] text-black">
        {children}
      </h2>
    </div>
  );
}
