// 선택지 점수 표시용 칩 — ScoreButton(inactive)과 같은 모양이지만 클릭되지 않는다.
export default function OptionChip({ score }: { score: number }) {
  return (
    <span className="flex items-center w-fit py-[3px] px-4 rounded-full border bg-gray-100 border-gray-200">
      <span className="font-medium text-[12px] text-gray-900">{score}</span>
    </span>
  );
}
