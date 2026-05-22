const OrderTableSkeleton = () => {
  const placeholderIds = [
    "order-skeleton-1",
    "order-skeleton-2",
    "order-skeleton-3",
    "order-skeleton-4",
    "order-skeleton-5",
    "order-skeleton-6",
  ];

  return (
    <div className="space-y-4">
      {placeholderIds.map((placeholderId) => (
        <div
          key={placeholderId}
          className="border border-light-gray bg-white p-4 animate-pulse"
        >
          <div className="h-5 w-40 bg-light-gray rounded" />
          <div className="h-4 w-56 bg-light-gray rounded mt-2" />
          <div className="h-4 w-24 bg-light-gray rounded mt-2" />
        </div>
      ))}
    </div>
  );
};

export default OrderTableSkeleton;
