interface ScoreRow {
  rank: number;
  teamName: string;
  majorAverage?: number;
  reportAverage?: number;
  communityAverage?: number;
  grandTotalAverage?: number;
}

interface Props {
  isLoading: boolean;
  isError: boolean;
  scoreRows: ScoreRow[];
}

function formatInt(value: number | undefined) {
  return String(Math.round(value ?? 0));
}

export default function ScoreCollectionTable({ isLoading, isError, scoreRows }: Props) {
  if (isLoading) {
    return <p className="py-10 text-center text-gray-400">불러오는 중...</p>;
  }

  if (isError) {
    return <p className="py-10 text-center text-red-400">점수를 불러오는 데 실패했습니다.</p>;
  }

  return (
    <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto">
      {/*
        min-w로 전체 컬럼 폭을 확보한다.
        - 데스크톱(max-w-4xl 컨테이너): 전체 컬럼이 한 화면에 들어온다.
        - 모바일: 폭이 넘쳐 가로 스크롤이 생기고, 좌측 핵심 정보(등수/팀명)가 먼저 보인다.
      */}
      <div className="min-w-[40rem]">
        <div className="flex items-center bg-[var(--color-orange-50)] dark:bg-[#85602c] h-9 sticky top-0 z-10">
          {/* 핵심 정보 */}
          <div className="w-16 sm:w-20 md:w-24 shrink-0 text-center font-medium text-sm sm:text-base text-gray-900">
            등수
          </div>
          <div className="flex-1 min-w-[6rem] text-center font-medium text-sm sm:text-base text-gray-900">
            팀명
          </div>
          {/* 영역별 평균 */}
          <div className="w-24 shrink-0 text-center font-medium text-sm sm:text-base text-gray-900">
            전공
          </div>
          <div className="w-24 shrink-0 text-center font-medium text-sm sm:text-base text-gray-900">
            보고서
          </div>
          <div className="w-24 shrink-0 text-center font-medium text-sm sm:text-base text-gray-900">
            사회
          </div>
          <div className="w-24 shrink-0 text-center font-medium text-sm sm:text-base text-gray-900">
            총점수
          </div>
        </div>
        {scoreRows.length === 0 ? (
          <p className="py-10 text-center text-gray-400 text-sm">
            해당 학년에 등록된 팀이 없습니다.
          </p>
        ) : (
          scoreRows.map((row) => (
            <div
              key={row.teamName}
              className="flex items-center h-11 border-t border-gray-100"
            >
              <div className="w-16 sm:w-20 md:w-24 shrink-0 text-center font-medium text-sm sm:text-base text-gray-900">
                {row.rank}
              </div>
              <div className="flex-1 min-w-[6rem] text-center font-medium text-sm sm:text-base truncate text-gray-900">
                {row.teamName}
              </div>
              {/* 영역별 평균 */}
              <div className="w-24 shrink-0 text-center text-sm sm:text-base text-gray-600">
                {formatInt(row.majorAverage)}
              </div>
              <div className="w-24 shrink-0 text-center text-sm sm:text-base text-gray-600">
                {formatInt(row.reportAverage)}
              </div>
              <div className="w-24 shrink-0 text-center text-sm sm:text-base text-gray-600">
                {formatInt(row.communityAverage)}
              </div>
              <div className="w-24 shrink-0 text-center text-sm sm:text-base text-gray-600">
                {formatInt(row.grandTotalAverage)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
