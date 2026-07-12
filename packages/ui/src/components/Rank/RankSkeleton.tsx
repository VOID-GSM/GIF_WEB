import PodiumCardSkeleton from "./PodiumCardSkeleton";
import RankListItemSkeleton from "./RankListItemSkeleton";
import type { Place } from "./podiumStyles";

const PODIUM_PLACES: Place[] = [1, 2, 3];

export default function RankSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8 md:gap-10">
      <div className="flex w-full items-end justify-center gap-2 sm:gap-4 md:gap-6">
        {PODIUM_PLACES.map((place) => (
          <PodiumCardSkeleton key={place} place={place} />
        ))}
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        {[4, 5].map((rank) => (
          <RankListItemSkeleton key={rank} />
        ))}
      </div>
    </div>
  );
}
