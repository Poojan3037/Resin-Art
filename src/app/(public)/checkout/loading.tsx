import Skeleton from "@/components/skeleton/Skeleton";

const CheckoutLoadingPage = () => (
  <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
    <Skeleton className="h-9 w-56 mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">
      <div className="space-y-5">
        {["a", "b", "c", "d", "e", "f"].map((key) => (
          <div key={key} className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-13 w-full" />
          </div>
        ))}
        <Skeleton className="h-12 w-48" />
      </div>
      <div className="bg-white border border-light-gray p-6 space-y-4 h-fit">
        <Skeleton className="h-6 w-40" />
        {["i1", "i2"].map((key) => (
          <div key={key} className="flex gap-4">
            <Skeleton className="h-16 w-16 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  </div>
);

export default CheckoutLoadingPage;
