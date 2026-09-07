import Button from "@/components/Button";
import type { ProductWithImagesType } from "@/types/product";
import type { ProductStatus } from "../../../../prisma/generated/prisma/client";

const statusColorMap: Record<ProductStatus, string> = {
  PUBLISHED: "text-green-600",
  OUT_OF_STOCK: "text-red-500",
  DRAFT: "text-gray",
  ARCHIVED: "text-gray",
};

const statusLabelMap: Record<ProductStatus, string> = {
  PUBLISHED: "Published",
  OUT_OF_STOCK: "Out of Stock",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};

const getStatusColor = (status: ProductStatus) =>
  statusColorMap[status] ?? "text-gray";

const formatProductStatus = (status: ProductStatus) =>
  statusLabelMap[status] ?? status;

type ProductListingPropsType = {
  products: ProductWithImagesType[];
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  onEdit: (product: ProductWithImagesType) => void;
  onDeleteRequest: (product: ProductWithImagesType) => void;
  onNotifyRequest: (product: ProductWithImagesType) => void;
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const ProductListing = ({
  products,
  search,
  onSearchChange,
  onAdd,
  onEdit,
  onDeleteRequest,
  onNotifyRequest,
}: ProductListingPropsType) => {
  return (
    <div className="bg-white border border-light-gray p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <Button type="button" onClick={onAdd} className="sm:w-auto w-full">
          Add Product
        </Button>

        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products..."
          className="px-4 py-2 border border-light-gray bg-cream text-[14px] w-full sm:w-70"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 gap-3">
          <h2 className="text-[20px] font-semibold text-charcoal">
            Product List
          </h2>
        </div>

        {products.length === 0 ? (
          <p className="text-gray text-[14px] py-8 text-center">
            No products found.
          </p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-light-gray p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="text-[16px] font-semibold text-charcoal">
                    {product.title}
                  </p>
                  <p className="text-[12px] text-gray">
                    {product.artistName} ·{" "}
                    <span
                      className={`font-medium ${getStatusColor(product.status)}`}
                    >
                      {formatProductStatus(product.status)}
                    </span>
                  </p>
                  <p className="text-[14px] text-gold font-semibold mt-1">
                    {currencyFormatter.format(
                      Number(product.discountPrice ?? product.price),
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* Only a published product has a public page to link to. */}
                  {product.status === "PUBLISHED" && (
                    <Button
                      variant="outline"
                      onClick={() => onNotifyRequest(product)}
                    >
                      {product.lastNotifiedAt ? "Notify Again" : "Notify"}
                    </Button>
                  )}
                  <Button variant="soft" onClick={() => onEdit(product)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDeleteRequest(product)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;
