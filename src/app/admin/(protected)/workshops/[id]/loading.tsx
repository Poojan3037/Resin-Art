const PLACEHOLDER_ROWS = [
  "registration-row-1",
  "registration-row-2",
  "registration-row-3",
  "registration-row-4",
  "registration-row-5",
];

const Loading = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 animate-pulse">
      <div className="h-4 w-36 bg-light-gray rounded" />

      <div className="mt-8 sm:mt-10 bg-white border border-light-gray p-6 sm:p-8">
        <div className="h-3 w-24 bg-light-gray rounded" />
        <div className="mt-3 h-9 w-64 bg-light-gray rounded" />
        <div className="mt-6 h-11 w-full max-w-md bg-light-gray rounded" />

        <div className="mt-8 space-y-4">
          {PLACEHOLDER_ROWS.map((rowKey) => (
            <div
              key={rowKey}
              className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_120px] gap-3 sm:gap-4 border border-light-gray p-4 rounded"
            >
              <div className="h-5 w-full bg-light-gray rounded" />
              <div className="h-5 w-full bg-light-gray rounded" />
              <div className="h-5 w-24 bg-light-gray rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
