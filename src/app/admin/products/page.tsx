"use client";

import { PRODUCTS } from "@/constants/shop";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState } from "react";

interface Product {
  name: string;
  price: string;
  img: string;
  tag: string;
}

const TAGS = ["", "Bestseller", "New", "Limited"];

const TAG_CLASSES: Record<string, string> = {
  Bestseller: "bg-gold text-white",
  New: "bg-teal text-white",
  Limited: "bg-pink text-white",
  "": "bg-light-gray text-gray",
};

const emptyForm: Product = { name: "", price: "", img: "", tag: "" };

export default function AdminProductsPage() {
  const [products, setProducts, hydrated] = useLocalStorage<Product[]>(
    "admin_products",
    PRODUCTS,
  );
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    index: number | null;
  }>({ open: false, mode: "add", index: null });
  const [form, setForm] = useState<Product>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ open: true, mode: "add", index: null });
  };

  const openEdit = (i: number) => {
    setForm({ ...products[i] });
    setModal({ open: true, mode: "edit", index: i });
  };

  const closeModal = () => {
    setModal({ open: false, mode: "add", index: null });
    setForm(emptyForm);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price.trim()) return;
    if (modal.mode === "add") {
      setProducts((prev) => [...prev, { ...form }]);
    } else if (modal.mode === "edit" && modal.index !== null) {
      setProducts((prev) =>
        prev.map((p, i) => (i === modal.index ? { ...form } : p)),
      );
    }
    closeModal();
  };

  const handleDelete = (i: number) => {
    setProducts((prev) => prev.filter((_, idx) => idx !== i));
    setDeleteConfirm(null);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <span className="text-[14px] tracking-[0.2em] uppercase text-gray">
          Loading…
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-[11px] tracking-[0.22em] uppercase text-gold">
            Manage
          </span>
          <h1 className="text-[clamp(28px,4vw,44px)] font-semibold text-charcoal mt-1">
            Products
          </h1>
          <p className="text-[13px] text-gray mt-1">
            {products.length} product{products.length === 1 ? "" : "s"} total
          </p>
        </div>
        <button
          onClick={openAdd}
          className="self-start sm:self-auto bg-charcoal text-gold-light px-5 py-3 text-[13px] tracking-[0.12em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-300"
        >
          + Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-sm">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-white"
        />
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray text-[14px] tracking-wide">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const realIndex = products.indexOf(product);
            return (
              <div
                key={product.name}
                className="bg-white border border-light-gray hover:border-gold transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-4/3 bg-light-gray">
                  {product.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray text-[13px] tracking-wide">
                      No image
                    </div>
                  )}
                  {product.tag && (
                    <span
                      className={`absolute top-3 left-3 text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 font-semibold ${TAG_CLASSES[product.tag] ?? "bg-light-gray text-gray"}`}
                    >
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[17px] font-semibold text-charcoal mb-1 leading-[1.3]">
                    {product.name}
                  </h3>
                  <span className="text-[20px] font-extrabold text-gold mb-4">
                    {product.price}
                  </span>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => openEdit(realIndex)}
                      className="flex-1 bg-charcoal text-gold-light py-2.5 text-[12px] tracking-[0.12em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(realIndex)}
                      className="flex-1 bg-transparent text-pink border border-blush py-2.5 text-[12px] tracking-[0.12em] uppercase font-semibold hover:bg-blush-light transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 px-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          onKeyDown={(e) => e.key === "Escape" && closeModal()}
        >
          <div className="bg-white w-full max-w-lg p-8 sm:p-10">
            <h2 className="text-[20px] font-semibold text-charcoal mb-1">
              {modal.mode === "add" ? "Add Product" : "Edit Product"}
            </h2>
            <p className="text-[13px] text-gray mb-7 tracking-wide">
              {modal.mode === "add"
                ? "Fill in the details for the new product."
                : "Update the product details below."}
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="prod-name"
                  className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
                >
                  Product Name *
                </label>
                <input
                  id="prod-name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
                  placeholder="e.g. Ocean Wave Resin Tray"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="prod-price"
                  className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
                >
                  Price *
                </label>
                <input
                  id="prod-price"
                  type="text"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
                  placeholder="e.g. $145"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="prod-img"
                  className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
                >
                  Image URL
                </label>
                <input
                  id="prod-img"
                  type="url"
                  value={form.img}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, img: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
                  placeholder="https://…"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="prod-tag"
                  className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
                >
                  Tag
                </label>
                <select
                  id="prod-tag"
                  value={form.tag}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tag: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
                >
                  {TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t === "" ? "None" : t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.price.trim()}
                className="flex-1 bg-charcoal text-gold-light py-3.5 text-[13px] tracking-[0.12em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {modal.mode === "add" ? "Add Product" : "Save Changes"}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-transparent text-charcoal border border-light-gray py-3.5 text-[13px] tracking-[0.12em] uppercase font-semibold hover:border-charcoal transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 px-4"
          onClick={(e) =>
            e.target === e.currentTarget && setDeleteConfirm(null)
          }
          onKeyDown={(e) => e.key === "Escape" && setDeleteConfirm(null)}
        >
          <div className="bg-white w-full max-w-sm p-8 text-center">
            <h2 className="text-[20px] font-semibold text-charcoal mb-2">
              Delete Product?
            </h2>
            <p className="text-[14px] text-gray mb-7">
              &ldquo;{products[deleteConfirm]?.name}&rdquo; will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-pink text-white py-3 text-[13px] tracking-[0.12em] uppercase font-semibold hover:opacity-80 transition-opacity duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-transparent text-charcoal border border-light-gray py-3 text-[13px] tracking-[0.12em] uppercase font-semibold hover:border-charcoal transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
