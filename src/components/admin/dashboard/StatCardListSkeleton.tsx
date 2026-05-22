const StatCardListSkeleton = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-light-gray p-5 sm:p-7 animate-pulse"
        >
          {/* Icon skeleton */}
          <div className="w-10 h-10 rounded-sm bg-gray-200 mb-4" />

          {/* Value skeleton */}
          <div className="h-8 w-16 bg-gray-200 rounded mb-2" />

          {/* Label skeleton */}
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
};

export default StatCardListSkeleton;
