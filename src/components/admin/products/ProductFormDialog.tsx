"use client";

import { createProduct, updateProduct } from "@/actions/product";
import Button from "@/components/Button";
import ImageUploader from "@/components/admin/products/ImageUploader";
import { ProductSchema, type ProductFormDataType } from "@/schema/product";
import type { ProductWithImagesType } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

type ProductFormDialogPropsType = {
  product: ProductWithImagesType | null;
  onClose: () => void;
  onSaved: () => void;
};

type DiscountType = "PERCENTAGE" | "FIXED";

const emptyValues: Partial<ProductFormDataType> = {
  title: "",
  description: "",
  artistName: "",
  price: "",
  discountPrice: "",
  quantity: undefined,
  isFeatured: false,
  status: "DRAFT",
  images: [],
};

const resolveDiscountPrice = ({
  discountType,
  discountPercent,
  discountAmount,
  price,
}: {
  discountType: DiscountType;
  discountPercent: string;
  discountAmount: string;
  price: string;
}): { value: string; error: string | null } => {
  const priceValue = Number(price);

  if (!Number.isFinite(priceValue) || priceValue < 0) {
    return { value: "", error: "Enter a valid product price first." };
  }

  if (discountType === "PERCENTAGE") {
    if (!discountPercent.trim()) {
      return { value: "", error: "Enter a discount percentage." };
    }

    const percentValue = Number(discountPercent);
    if (Number.isNaN(percentValue) || percentValue < 0 || percentValue > 100) {
      return {
        value: "",
        error: "Discount percentage must be between 0 and 100.",
      };
    }

    return {
      value: (priceValue - (priceValue * percentValue) / 100).toFixed(2),
      error: null,
    };
  }

  if (discountAmount.trim()) {
    const amountValue = Number(discountAmount);
    if (Number.isNaN(amountValue) || amountValue < 0) {
      return {
        value: "",
        error: "Flat discount amount must be a valid positive value.",
      };
    }

    if (amountValue > priceValue) {
      return {
        value: "",
        error: "Flat discount amount cannot be greater than product price.",
      };
    }

    return { value: (priceValue - amountValue).toFixed(2), error: null };
  }

  return { value: "", error: null };
};

const ProductFormDialog = ({
  product,
  onClose,
  onSaved,
}: ProductFormDialogPropsType) => {
  const initialDiscountAmount = (() => {
    if (!product) return "";

    const parsedPrice = Number(product.price);
    const parsedDiscountPrice = product.discountPrice
      ? Number(product.discountPrice)
      : Number.NaN;

    if (
      !Number.isFinite(parsedPrice) ||
      !Number.isFinite(parsedDiscountPrice)
    ) {
      return "";
    }

    return Math.max(parsedPrice - parsedDiscountPrice, 0).toFixed(2);
  })();

  const defaultValues: Partial<ProductFormDataType> = product
    ? {
        title: product.title,
        description: product.description,
        artistName: product.artistName,
        price: product.price,
        discountPrice: product.discountPrice ?? "",
        quantity: product.quantity,
        isFeatured: product.isFeatured,
        status: product.status,
        images: product.images.map((image, index) => ({
          url: image.url,
          altText: image.altText ?? "",
          isPrimary: image.isPrimary,
          sortOrder: image.sortOrder ?? index,
        })),
      }
    : emptyValues;

  const [discountType, setDiscountType] = useState<DiscountType>("FIXED");
  const [discountPercent, setDiscountPercent] = useState("");
  const [discountAmount, setDiscountAmount] = useState(initialDiscountAmount);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormDataType>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const images = useWatch({ control, name: "images" });
  const currentStatus = useWatch({ control, name: "status" });

  const statusOptions = [
    { value: "DRAFT", label: "Draft" },
    { value: "PUBLISHED", label: "Published" },
    { value: "OUT_OF_STOCK", label: "Out of Stock" },
    { value: "ARCHIVED", label: "Archived" },
  ] as const;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const onSubmit = (formData: ProductFormDataType) => {
    const resolvedDiscount = resolveDiscountPrice({
      discountType,
      discountPercent,
      discountAmount,
      price: formData.price,
    });

    if (resolvedDiscount.error) {
      toast.error(resolvedDiscount.error);
      return;
    }

    const payload: ProductFormDataType = {
      ...formData,
      discountPrice: resolvedDiscount.value,
    };

    startTransition(async () => {
      const result = product
        ? await updateProduct(null, { ...payload, id: product.id })
        : await createProduct(null, payload);

      if (!result?.success) {
        toast.error(result?.message ?? "Unable to save product.");
        return;
      }

      toast.success(result.message);
      onSaved();
      onClose();
    });
  };

  let submitLabel = "Create Product";
  if (product) submitLabel = "Save Changes";
  if (isPending) submitLabel = "Saving...";

  return (
    <>
      <div className="fixed inset-0 bg-charcoal/60 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div className="bg-white p-8 sm:p-10 max-h-[90vh] overflow-y-auto w-full max-w-3xl pointer-events-auto">
          <h2 className="text-[20px] font-semibold text-charcoal mb-1">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <p className="text-[13px] text-gray mb-6 tracking-wide">
            {product
              ? "Update the product details and save changes."
              : "Fill in product details to create a new listing."}
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                {...register("title")}
                placeholder="Enter product title"
                className="w-full px-4 py-3 border border-light-gray bg-cream"
              />
              <p className="text-red-500 text-[12px] mt-1">
                {errors.title?.message}
              </p>
            </div>

            <div>
              <input
                {...register("artistName")}
                placeholder="Enter artist name"
                className="w-full px-4 py-3 border border-light-gray bg-cream"
              />
              <p className="text-red-500 text-[12px] mt-1">
                {errors.artistName?.message}
              </p>
            </div>

            <div>
              <textarea
                {...register("description")}
                placeholder="Enter product description"
                rows={4}
                className="w-full px-4 py-3 border border-light-gray bg-cream"
              />
              <p className="text-red-500 text-[12px] mt-1">
                {errors.description?.message}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="product-price"
                  className="block text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold mb-1.5"
                >
                  Price
                </label>
                <input
                  id="product-price"
                  {...register("price")}
                  placeholder="Enter product price"
                  className="w-full px-4 py-3 border border-light-gray bg-cream"
                />
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.price?.message}
                </p>
              </div>

              <div>
                <label
                  htmlFor="product-quantity"
                  className="block text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold mb-1.5"
                >
                  Quantity
                </label>
                <input
                  id="product-quantity"
                  type="number"
                  min={0}
                  {...register("quantity", { valueAsNumber: true })}
                  placeholder="Enter available quantity"
                  className="w-full px-4 py-3 border border-light-gray bg-cream"
                />
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.quantity?.message}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="discount-type"
                  className="block text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold mb-1.5"
                >
                  Discount Type
                </label>
                <select
                  id="discount-type"
                  value={discountType}
                  onChange={(event) => {
                    const nextType = event.target.value as DiscountType;
                    setDiscountType(nextType);
                    setDiscountPercent("");
                    setDiscountAmount("");
                  }}
                  className="w-full px-4 py-3 border border-light-gray bg-cream"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount</option>
                </select>
                <p className="text-[12px] text-gray mt-1">
                  Select one discount mode to avoid conflicting values.
                </p>
              </div>

              <div>
                {discountType === "PERCENTAGE" ? (
                  <>
                    <label
                      htmlFor="discount-percentage"
                      className="block text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold mb-1.5"
                    >
                      Discount Percentage (%)
                    </label>
                    <input
                      id="discount-percentage"
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      value={discountPercent}
                      onChange={(event) =>
                        setDiscountPercent(event.target.value)
                      }
                      placeholder="Enter discount percentage"
                      className="w-full px-4 py-3 border border-light-gray bg-cream"
                    />
                    <p className="text-[12px] text-gray mt-1">
                      Example: 10 means product price is reduced by 10%.
                    </p>
                  </>
                ) : (
                  <>
                    <label
                      htmlFor="discount-amount"
                      className="block text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold mb-1.5"
                    >
                      Flat Discount Amount
                    </label>
                    <input
                      id="discount-amount"
                      type="number"
                      min={0}
                      step="0.01"
                      value={discountAmount}
                      onChange={(event) =>
                        setDiscountAmount(event.target.value)
                      }
                      placeholder="Enter flat discount amount"
                      className="w-full px-4 py-3 border border-light-gray bg-cream"
                    />
                    <p className="text-[12px] text-gray mt-1">
                      Example: if price is 120 and amount is 20, final price
                      becomes 100.
                    </p>
                  </>
                )}
              </div>
            </div>

            <p className="text-red-500 text-[12px] mt-1">
              {errors.discountPrice?.message}
            </p>

            <div className="space-y-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold mb-2">
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("status", opt.value)}
                      className={`px-4 py-2 text-[13px] border transition-colors ${
                        currentStatus === opt.value
                          ? "bg-charcoal text-white border-charcoal"
                          : "bg-cream text-charcoal border-light-gray hover:border-charcoal"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.status?.message}
                </p>
              </div>

              <label className="inline-flex items-center gap-2 text-[13px]">
                <input type="checkbox" {...register("isFeatured")} /> Featured
                product
              </label>
            </div>

            <div className="pt-1">
              <ImageUploader
                onUploaded={(url) => {
                  setValue("images", [
                    ...(images ?? []),
                    {
                      url,
                      altText: "",
                      isPrimary: (images ?? []).length === 0,
                      sortOrder: (images ?? []).length,
                    },
                  ]);
                  toast.success("Image uploaded.");
                }}
              />
            </div>

            {(images ?? []).length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(images ?? []).map((image, index) => (
                  <div key={`${image.url}-${index}`} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.altText ?? "Product image"}
                      className="h-20 w-full object-cover border border-light-gray"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white border border-light-gray w-6 h-6 text-[12px]"
                      onClick={() => {
                        setValue(
                          "images",
                          (images ?? []).filter(
                            (_, imageIndex) => imageIndex !== index,
                          ),
                        );
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <p className="text-red-500 text-[12px]">
              {errors.images?.message as string | undefined}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <Button
                type="submit"
                isLoading={isPending}
                disabled={isPending}
                className="sm:flex-1"
              >
                {submitLabel}
              </Button>
              <Button
                type="button"
                variant="soft"
                onClick={onClose}
                disabled={isPending}
                className="sm:flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductFormDialog;
