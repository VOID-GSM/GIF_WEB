interface ScoreRow {
  rank: number;
  teamName: string;
  totalScore: number;
}

interface Props {
  isLoading: boolean;
  isError: boolean;
  scoreRows: ScoreRow[];
}

export default function ScoreCollectionTable({ isLoading, isError, scoreRows }: Props) {
  if (isLoading) {
    return <p className="py-10 text-center text-gray-400">불러오는 중...</p>;
  }

  if (isError) {
    return <p className="py-10 text-center text-red-400">점수를 불러오는 데 실패했습니다.</p>;
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="flex items-center justify-between bg-orange-50 h-9 sticky top-0 z-10">
        <div className="flex gap-1.5">
          <div className="w-12 sm:w-16 md:w-20 text-center font-medium text-sm sm:text-base">
            등수
          </div>
          <div className="flex-1 text-center font-medium text-sm sm:text-base">
            팀명
          </div>
        </div>
        <div className="w-24 sm:w-32 md:w-40 text-center font-medium text-sm sm:text-base">
          점수 수합
        </div>
      </div>
      {scoreRows.length === 0 ? (
        <p className="py-10 text-center text-gray-400 text-sm">
          해당 학년에 등록된 팀이 없습니다.
        </p>
      ) : (
        scoreRows.map(({ rank, teamName, totalScore }) => (
          <div
            key={teamName}
            className="flex justify-between items-center h-11 border-t border-gray-100"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-12 sm:w-16 md:w-20 text-center font-medium text-sm sm:text-base">
                {rank}
              </div>
              <div className="flex-1 text-center font-medium text-sm sm:text-base">
                {teamName}
              </div>
            </div>
            <div className="w-24 sm:w-32 md:w-40 text-center font-medium text-sm sm:text-base">
              {totalScore}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
