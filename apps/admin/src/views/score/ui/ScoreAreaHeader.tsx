import ScoreTabNav from "./ScoreTabNav";

interface Props {
  onBack: () => void;
}

export default function ScoreAreaHeader({ onBack }: Props) {
  return (
    <div className="w-full max-w-[980px] mx-auto flex flex-col gap-1">
      <ScoreTabNav />
      <button
        onClick={onBack}
        className="text-lg font-semibold text-gray-700 hover:text-gray-900 cursor-pointer flex items-center gap-2 mt-1 w-fit"
      >
        ← 뒤로
      </button>
    </div>
  );
}
