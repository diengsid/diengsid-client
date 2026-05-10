export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse pb-2">
      {/* Icon circle */}
      <div className="w-6 h-6 rounded-full bg-gray-300" />

      {/* Label */}
      <div className="h-3 w-12 bg-gray-300 rounded" />
    </div>
  );
}
