import type { RankItem } from "@repo/lib";

import PodiumCard from "./PodiumCard";
import RankListItem from "./RankListItem";

interface RankBoardProps {
  items: RankItem[];
}

export default function RankBoard({ items }: RankBoardProps) {
  const top3 = items.slice(0, 3);
  const rest = items.slice(3, 5);

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8 md:gap-10">
      <div className="flex w-full items-end justify-center gap-2 sm:gap-4 md:gap-6">
        {top3.map((item) => (
          <PodiumCard key={item.rank} item={item} />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          {rest.map((item) => (
            <RankListItem key={item.rank} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
