const AdminSubscribersLoadingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="h-10 w-60 bg-light-gray animate-pulse mb-8" />
      <div className="bg-white border border-light-gray p-5 sm:p-6 space-y-3">
        {new Array(5).fill(0).map((item, index) => (
          <div
            key={item + index}
            className="h-20 bg-light-gray/60 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};

export default AdminSubscribersLoadingPage;
