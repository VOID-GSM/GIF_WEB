export const PODIUM_STYLES = {
  1: {
    order: "order-2",
    grow: "w-24 sm:w-48 md:w-64",
    lift: "-translate-y-2 sm:-translate-y-4 md:-translate-y-6",
    crown: "h-5 w-5 text-yellow-600 sm:h-7 sm:w-7 md:h-10 md:w-10",
    crownOffset: "-top-6 sm:-top-8 md:-top-12",
    badge: "bg-gradient-to-b from-yellow-700 to-yellow-900",
    badgeSize:
      "h-5 w-5 text-[10px] ring-1 sm:h-8 sm:w-8 sm:text-sm sm:ring-2 md:h-9 md:w-9 md:text-base",
    nameBar: "bg-yellow-50",
    cardShadow: "shadow-lg",
    namePad: "px-2 py-2 sm:px-5 sm:py-4 md:px-6 md:py-5",
    nameText: "text-xs font-bold sm:text-lg md:text-xl",
    teamText: "text-[10px] sm:text-base",
  },
  2: {
    order: "order-1",
    grow: "w-20 sm:w-40 md:w-56",
    lift: "-translate-y-1 sm:-translate-y-2 md:-translate-y-3",
    crown: "h-5 w-5 text-gray-400 sm:h-7 sm:w-7 md:h-9 md:w-9",
    crownOffset: "-top-7 sm:-top-9 md:-top-11",
    badge: "bg-gradient-to-b from-gray-400 to-gray-600",
    badgeSize:
      "h-4 w-4 text-[9px] ring-1 sm:h-7 sm:w-7 sm:text-xs sm:ring-2 md:h-8 md:w-8 md:text-sm",
    nameBar: "bg-gray-100",
    cardShadow: "shadow-new",
    namePad: "px-1.5 py-1.5 sm:px-4 sm:py-3 md:px-5 md:py-4",
    nameText: "text-[10px] font-semibold sm:text-base md:text-lg",
    teamText: "text-[9px] sm:text-sm",
  },
  3: {
    order: "order-3",
    grow: "w-20 sm:w-40 md:w-56",
    lift: "",
    crown: "h-3.5 w-3.5 text-orange-500 sm:h-5 sm:w-5 md:h-7 md:w-7",
    crownOffset: "-top-6 sm:-top-7 md:-top-9",
    badge: "bg-gradient-to-b from-orange-400 to-orange-700",
    badgeSize:
      "h-3.5 w-3.5 text-[8px] ring-1 sm:h-6 sm:w-6 sm:text-xs sm:ring-2 md:h-7 md:w-7 md:text-xs",
    nameBar: "bg-orange-50",
    cardShadow: "shadow-sm",
    namePad: "px-1.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3",
    nameText: "text-[9px] font-medium sm:text-sm md:text-base",
    teamText: "text-[8px] sm:text-xs",
  },
} as const;

export type Place = keyof typeof PODIUM_STYLES;

export function toPlace(rank: number): Place {
  return (rank <= 3 ? rank : 3) as Place;
}
