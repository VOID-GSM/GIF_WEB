import type { RankItem } from "@repo/lib";

import ProjectLogo from "../ProjectLogo/ProjectLogo";
import Crown from "../../svg/Crown";
import { PODIUM_STYLES, toPlace } from "./podiumStyles";

interface PodiumCardProps {
  item: RankItem;
}

export default function PodiumCard({ item }: PodiumCardProps) {
  const style = PODIUM_STYLES[toPlace(item.rank)];

  return (
    <div
      className={`relative flex min-w-0 flex-none flex-col ${style.grow} ${style.order} ${style.lift}`}
    >
      <Crown
        className={`absolute left-1/2 -translate-x-1/2 ${style.crownOffset} ${style.crown}`}
      />
      <div
        className={`relative overflow-hidden rounded-lg bg-white sm:rounded-2xl md:rounded-3xl ${style.cardShadow}`}
      >
        <span
          className={`absolute top-1 left-1 z-10 flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-white sm:top-3 sm:left-3 ${style.badgeSize} ${style.badge}`}
        >
          {item.rank}
        </span>
        <div className="aspect-square w-full">
          <ProjectLogo
            src={item.logo}
            alt={item.name}
            className="h-full w-full object-cover"
            fallbackClassName="h-full w-full bg-white object-contain p-2 sm:p-4 md:p-6"
          />
        </div>
        <div className={`flex flex-col gap-0.5 ${style.namePad} ${style.nameBar}`}>
          <p className={`truncate text-gray-900 ${style.nameText}`}>{item.name}</p>
          <p className={`truncate font-medium text-gray-600 ${style.teamText}`}>
            {item.teamName}
          </p>
        </div>
      </div>
    </div>
  );
}
