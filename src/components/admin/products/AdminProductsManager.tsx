"use client";

import ProductFormDialog from "@/components/admin/products/ProductFormDialog";
import ProductListing from "@/components/admin/products/ProductListing";
import ProductDeleteDialog from "@/components/admin/products/ProductDeleteDialog";
import type { ProductWithImagesType } from "@/types/product";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, debounce } from "nuqs";

type AdminProductsManagerPropsType = {
  products: ProductWithImagesType[];
};

const AdminProductsManager = ({ products }: AdminProductsManagerPropsType) => {
  const router = useRouter();

  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    limitUrlUpdates: debounce(500),
    shallow: false,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithImagesType | null>(null);

  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [deleteProductTitle, setDeleteProductTitle] = useState("");

  const openAddDialog = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: ProductWithImagesType) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (product: ProductWithImagesType) => {
    setDeleteProductId(product.id);
    setDeleteProductTitle(product.title);
  };

  const closeDeleteDialog = () => {
    setDeleteProductId(null);
    setDeleteProductTitle("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8">
        <span className="text-[11px] tracking-[0.22em] uppercase text-gold">
          Manage
        </span>
        <h1 className="text-[clamp(28px,4vw,44px)] font-semibold text-charcoal mt-1">
          Products
        </h1>
        <p className="text-[13px] text-gray mt-1">
          {products.length} products total
        </p>
      </div>

      <ProductListing
        products={products}
        search={search}
        onSearchChange={setSearch}
        onAdd={openAddDialog}
        onEdit={handleEdit}
        onDeleteRequest={handleDeleteRequest}
      />

      {isFormOpen ? (
        <ProductFormDialog
          product={editingProduct}
          onClose={closeFormDialog}
          onSaved={router.refresh}
        />
      ) : null}

      {deleteProductId ? (
        <ProductDeleteDialog
          productId={deleteProductId}
          productTitle={deleteProductTitle}
          onClose={closeDeleteDialog}
          onDeleted={router.refresh}
        />
      ) : null}
    </div>
  );
};

export default AdminProductsManager;
