import { PODIUM_STYLES, type Place } from "./podiumStyles";

interface PodiumCardSkeletonProps {
  place: Place;
}

export default function PodiumCardSkeleton({ place }: PodiumCardSkeletonProps) {
  const style = PODIUM_STYLES[place];

  return (
    <div
      className={`flex min-w-0 flex-none flex-col ${style.grow} ${style.lift}`}
    >
      <div
        className={`overflow-hidden rounded-lg bg-white sm:rounded-2xl md:rounded-3xl ${style.cardShadow}`}
      >
        <div className="aspect-square w-full animate-pulse bg-gray-200" />
        <div className={`flex flex-col gap-2 ${style.namePad}`}>
          <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200 sm:h-5" />
          <div className="h-2.5 w-1/2 animate-pulse rounded bg-gray-200 sm:h-4" />
        </div>
      </div>
    </div>
  );
}
