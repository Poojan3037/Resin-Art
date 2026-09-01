import Skeleton from "@/components/skeleton/Skeleton";

const ForgotPasswordLoadingPage = () => (
  <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-14">
    <div className="w-full max-w-md bg-white border border-light-gray p-8 sm:p-10 space-y-5">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-64 mb-3" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-13 w-full" />
      </div>
      <Skeleton className="h-13 w-full" />
    </div>
  </div>
);

export default ForgotPasswordLoadingPage;
