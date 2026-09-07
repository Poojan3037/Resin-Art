/**
 * Root fallback for any route without its own `loading.tsx`.
 *
 * Server component, so the animation is pure CSS — no GSAP, which would pull
 * a client bundle into the one screen that must appear instantly.
 */
const Loading = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6">
      <div
        className="relative w-16 h-16"
        role="status"
        aria-label="Loading"
      >
        {/* Resin pour: a gold ring tracing over a still teal one. */}
        <span className="absolute inset-0 rounded-full border-2 border-teal/25" />
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin [animation-duration:1.1s]" />
        <span className="absolute inset-3 rounded-full bg-blush/40 animate-ping [animation-duration:1.8s]" />
        <span className="absolute inset-5 rounded-full bg-gold/70" />
      </div>
      <span className="text-[12px] tracking-[0.2em] uppercase text-gray">
        Loading…
      </span>
    </div>
  );
};

export default Loading;
