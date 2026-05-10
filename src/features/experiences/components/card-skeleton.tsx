export function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {/* Image */}
      <div className="w-full h-40 rounded-xl bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-[shimmer_1.5s_infinite]" />

      {/* Title */}
      <div className="h-4 bg-gray-300 rounded w-3/4" />

      {/* Subtitle */}
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
