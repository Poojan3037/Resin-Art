import Skeleton from "@/components/skeleton/Skeleton";

const SignupLoadingPage = () => (
  <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-14">
    <div className="w-full max-w-md bg-white border border-light-gray p-8 sm:p-10 space-y-5">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-64 mb-3" />
      <div className="grid grid-cols-2 gap-4">
        {["first", "last"].map((key) => (
          <div key={key} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-13 w-full" />
          </div>
        ))}
      </div>
      {["email", "password", "confirm"].map((key) => (
        <div key={key} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-13 w-full" />
        </div>
      ))}
      <Skeleton className="h-13 w-full" />
    </div>
  </div>
);

export default SignupLoadingPage;
