"use client";

import Button from "@/components/Button";

const ShopErrorPage = ({ reset }: { reset: () => void }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h2 className="text-[30px] text-charcoal font-semibold">
        Unable to load products
      </h2>
      <p className="text-gray mt-3">
        Something went wrong while loading the shop.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
};

export default ShopErrorPage;
