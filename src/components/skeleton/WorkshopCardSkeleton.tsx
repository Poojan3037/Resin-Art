import Skeleton from "./Skeleton";

const WorkshopCardSkeleton = () => {
  return (
    <div className="bg-white p-8 border border-light-gray h-full">
      <div className="flex justify-between items-center mb-5">
        <Skeleton className="rounded w-16 h-6" />
      </div>
      <Skeleton className="rounded h-6 w-3/4 mb-4" />
      <div className="flex flex-col gap-2 mb-7">
        {["row-1", "row-2", "row-3"].map((rowKey) => (
          <div key={rowKey} className="flex gap-2.5 items-center">
            <Skeleton className="rounded w-6 h-6" />
            <Skeleton className="rounded w-1/2 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkshopCardSkeleton;
