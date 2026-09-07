import clsx from "clsx";

/**
 * The one placeholder block every skeleton is built from, so route skeletons
 * stay on the palette (`light-gray`) instead of drifting to Tailwind's default
 * grays.
 */
const Skeleton = ({ className }: { className?: string }) => (
  <div className={clsx("bg-light-gray animate-pulse", className)} />
);

export default Skeleton;
