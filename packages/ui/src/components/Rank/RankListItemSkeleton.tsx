export default function RankListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm md:px-6 md:py-4">
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
      <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200" />
      <div className="flex flex-col gap-2">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
