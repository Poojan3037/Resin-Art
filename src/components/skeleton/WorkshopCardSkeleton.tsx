const WorkshopCardSkeleton = () => {
  return (
    <div className="bg-white p-8 border border-light-gray h-full">
      <div className="flex justify-between items-center mb-5">
        <span className="bg-gray-300 animate-pulse text-[24px] font-extrabold rounded w-16 h-6"></span>
      </div>
      <div className="bg-gray-300 animate-pulse text-[22px] font-semibold mb-4 leading-[1.3] rounded h-6 w-3/4"></div>
      <div className="flex flex-col gap-2 mb-7">
        <div className="flex gap-2.5 items-center">
          <span className="bg-gray-300 animate-pulse text-[13px] rounded w-6 h-6"></span>
          <span className="bg-gray-300 animate-pulse text-[14px] rounded w-1/2 h-4"></span>
        </div>
        <div className="flex gap-2.5 items-center">
          <span className="bg-gray-300 animate-pulse text-[13px] rounded w-6 h-6"></span>
          <span className="bg-gray-300 animate-pulse text-[14px] rounded w-1/2 h-4"></span>
        </div>
        <div className="flex gap-2.5 items-center">
          <span className="bg-gray-300 animate-pulse text-[13px] rounded w-6 h-6"></span>
          <span className="bg-gray-300 animate-pulse text-[14px] rounded w-1/2 h-4"></span>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCardSkeleton;
