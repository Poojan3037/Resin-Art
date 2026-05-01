"use client";

import { WORKSHOPS_DATA } from "@/constants/workshops";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState } from "react";

interface Workshop {
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  seats: number;
}

const emptyForm: Workshop = {
  title: "",
  date: "",
  time: "",
  location: "",
  price: "",
  seats: 10,
};

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops, hydrated] = useLocalStorage<Workshop[]>(
    "admin_workshops",
    WORKSHOPS_DATA,
  );
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    index: number | null;
  }>({ open: false, mode: "add", index: null });
  const [form, setForm] = useState<Workshop>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ open: true, mode: "add", index: null });
  };

  const openEdit = (i: number) => {
    setForm({ ...workshops[i] });
    setModal({ open: true, mode: "edit", index: i });
  };

  const closeModal = () => {
    setModal({ open: false, mode: "add", index: null });
    setForm(emptyForm);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.date.trim()) return;
    if (modal.mode === "add") {
      setWorkshops((prev) => [...prev, { ...form }]);
    } else if (modal.mode === "edit" && modal.index !== null) {
      setWorkshops((prev) =>
        prev.map((w, i) => (i === modal.index ? { ...form } : w)),
      );
    }
    closeModal();
  };

  const handleDelete = (i: number) => {
    setWorkshops((prev) => prev.filter((_, idx) => idx !== i));
    setDeleteConfirm(null);
  };

  const filtered = workshops.filter(
    (w) =>
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.location.toLowerCase().includes(search.toLowerCase()),
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
            Workshops
          </h1>
          <p className="text-[13px] text-gray mt-1">
            {workshops.length} workshop{workshops.length === 1 ? "" : "s"}{" "}
            scheduled
          </p>
        </div>
        <button
          onClick={openAdd}
          className="self-start sm:self-auto bg-charcoal text-gold-light px-5 py-3 text-[13px] tracking-[0.12em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-300"
        >
          + Add Workshop
        </button>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-sm">
        <input
          type="text"
          placeholder="Search workshops…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-white"
        />
      </div>

      {/* Workshop cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray text-[14px] tracking-wide">
          No workshops found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((w) => {
            const realIndex = workshops.indexOf(w);
            return (
              <div
                key={`${w.date}-${w.title}`}
                className="bg-white border border-light-gray hover:border-gold transition-all duration-300 p-7 flex flex-col"
              >
                {/* Seats badge + price */}
                <div className="flex justify-between items-center mb-5">
                  <span
                    className={
                      w.seats <= 3
                        ? "bg-amber-100 text-amber-700 text-[11px] px-3 py-1 uppercase tracking-widest font-semibold"
                        : "bg-teal-50 text-teal text-[11px] px-3 py-1 uppercase tracking-widest font-semibold"
                    }
                  >
                    {w.seats} seats
                  </span>
                  <span className="text-gold text-[22px] font-extrabold">
                    {w.price}
                  </span>
                </div>

                <h3 className="text-[19px] font-semibold text-charcoal mb-4 leading-[1.3]">
                  {w.title}
                </h3>

                <div className="flex flex-col gap-2 mb-7 flex-1">
                  {(
                    [
                      ["📅", w.date],
                      ["🕐", w.time],
                      ["📍", w.location],
                    ] as [string, string][]
                  ).map(([ic, val]) => (
                    <div key={val} className="flex gap-2.5 items-center">
                      <span className="text-[13px]">{ic}</span>
                      <span className="text-[13px] text-gray">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
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
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 px-4 py-8 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          onKeyDown={(e) => e.key === "Escape" && closeModal()}
        >
          <div className="bg-white w-full max-w-lg p-8 sm:p-10 my-auto">
            <h2 className="text-[20px] font-semibold text-charcoal mb-1">
              {modal.mode === "add" ? "Add Workshop" : "Edit Workshop"}
            </h2>
            <p className="text-[13px] text-gray mb-7 tracking-wide">
              {modal.mode === "add"
                ? "Fill in the details for the new workshop."
                : "Update the workshop details below."}
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="ws-title"
                  className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
                >
                  Title *
                </label>
                <input
                  id="ws-title"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
                  placeholder="e.g. Resin Fluid Art — Beginner Session"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="ws-date"
                    className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
                  >
                    Date *
                  </label>
                  <input
                    id="ws-date"
                    type="text"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
                    placeholder="May 18, 2026"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="ws-time"
                    className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
                  >
                    Time
                  </label>
                  <input
                    id="ws-time"
                    type="text"
                    value={form.time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, time: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
                    placeholder="2:00 PM – 5:00 PM"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="ws-location"
                  className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
                >
                  Location
                </label>
                <input
                  id="ws-location"
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
                  placeholder="Studio 44, Calgary NW"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="ws-price"
                    className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
                  >
                    Price
                  </label>
                  <input
                    id="ws-price"
                    type="text"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
                    placeholder="$85"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="ws-seats"
                    className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold"
                  >
                    Available Seats
                  </label>
                  <input
                    id="ws-seats"
                    type="number"
                    min={0}
                    value={form.seats}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        seats: Number(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleSave}
                disabled={!form.title.trim() || !form.date.trim()}
                className="flex-1 bg-charcoal text-gold-light py-3.5 text-[13px] tracking-[0.12em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {modal.mode === "add" ? "Add Workshop" : "Save Changes"}
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
              Delete Workshop?
            </h2>
            <p className="text-[14px] text-gray mb-7">
              &ldquo;{workshops[deleteConfirm]?.title}&rdquo; will be
              permanently removed.
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
