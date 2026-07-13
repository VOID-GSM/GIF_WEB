import type { RankItem } from "@repo/lib";

import ProjectLogo from "../ProjectLogo/ProjectLogo";

interface RankListItemProps {
  item: RankItem;
}

export default function RankListItem({ item }: RankListItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm md:px-6 md:py-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
        {item.rank}
      </span>
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
        <ProjectLogo
          src={item.logo}
          alt={item.name}
          className="h-full w-full object-cover"
          fallbackClassName="h-full w-full bg-gray-50 object-contain p-2"
        />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-base font-semibold text-gray-900 md:text-lg">
          {item.name}
        </span>
        <span className="truncate text-sm font-medium text-gray-500">
          {item.teamName}
        </span>
      </div>
    </div>
  );
}
