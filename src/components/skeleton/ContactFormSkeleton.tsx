import Skeleton from "./Skeleton";

/** Mirrors the three-field contact form so the page does not flash empty. */
const ContactFormSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-9 w-64 mb-6" />
    {["name", "email"].map((field) => (
      <div key={field} className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-13 w-full" />
      </div>
    ))}
    <div className="space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-40 w-full" />
    </div>
    <Skeleton className="h-12 w-40" />
  </div>
);

export default ContactFormSkeleton;
