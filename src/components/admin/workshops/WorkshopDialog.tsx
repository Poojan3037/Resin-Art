"use client";

import Button from "@/components/Button";
import { useRef, useEffect, useActionState, startTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkshopSchema, WorkshopFormData } from "@/schema/workshop";
import { DialogMode } from "@/types/dialog";
import { addWorkshop, editWorkshop } from "@/actions/workshop";
import { toast } from "sonner";
import { Workshop } from "@/types/workshop";

type PropsType = {
  mode: DialogMode;
  editWorkshopId: string | null;
  initialData?: null | Workshop;
  onClose: () => void;
};

const defaultValues: WorkshopFormData = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  price: 0,
  totalSeats: 10,
  showToUsers: false,
  status: "UPCOMING",
};

const to24HourTime = (time: string, period: string): string => {
  const [hourStr, minuteStr] = time.split(":");
  let hour = Number(hourStr);
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minuteStr}`;
};

const toFormValues = (workshop: Workshop): WorkshopFormData => ({
  title: workshop.title,
  description: workshop.description,
  date: workshop.date.slice(0, 10),
  startTime: to24HourTime(workshop.startTime, workshop.startPeriod),
  endTime: to24HourTime(workshop.endTime, workshop.endPeriod),
  location: workshop.location,
  price: workshop.price,
  totalSeats: workshop.totalSeats,
  showToUsers: workshop.showToUsers,
  status: workshop.status,
});

const inputClass =
  "w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-cream";
const labelClass =
  "text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold";
const errorClass = "text-[12px] text-pink mt-0.5";

const WorkshopDialog = ({
  mode,
  editWorkshopId,
  onClose,
  initialData,
}: PropsType) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [addState, addDispatch, isAddPending] = useActionState(
    addWorkshop,
    null,
  );
  const [editState, editDispatch, isEditPending] = useActionState(
    editWorkshop,
    null,
  );

  const isPending = isAddPending || isEditPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<WorkshopFormData>({
    resolver: zodResolver(WorkshopSchema),
    defaultValues: initialData ? toFormValues(initialData) : defaultValues,
  });

  const onSubmit = (data: WorkshopFormData) => {
    startTransition(() => {
      if (editWorkshopId) {
        editDispatch({ ...data, id: editWorkshopId });
      } else {
        addDispatch(data);
      }
    });
  };

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const state = editWorkshopId ? editState : addState;
    if (!state) return;
    if (state.success) {
      toast.success(state.message);
      onClose();
    } else {
      toast.error(state.message);
    }
  }, [addState, editState, editWorkshopId, onClose]);

  const submitLabel = mode === DialogMode.ADD ? "Add Workshop" : "Save Changes";

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg p-0 border-0 bg-transparent backdrop:bg-charcoal/60"
    >
      <div className="bg-white p-8 sm:p-10 overflow-y-auto max-h-[90vh]">
        <h2 className="text-[20px] font-semibold text-charcoal mb-1">
          {mode === DialogMode.ADD ? "Add Workshop" : "Edit Workshop"}
        </h2>
        <p className="text-[13px] text-gray mb-7 tracking-wide">
          {mode === DialogMode.ADD
            ? "Fill in the details for the new workshop."
            : "Update the workshop details below."}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ws-title" className={labelClass}>
              Title *
            </label>
            <input
              id="ws-title"
              {...register("title")}
              className={inputClass}
              placeholder="e.g. Resin Fluid Art — Beginner Session"
            />
            {errors.title && (
              <p className={errorClass}>{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="ws-title" className={labelClass}>
              Description
            </label>
            <textarea
              id="ws-description"
              {...register("description")}
              className={inputClass}
              placeholder="e.g. A relaxed evening format with guided resin pouring, expressive color play, and a social atmosphere that stays beginner friendly."
            />
            {errors.description && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ws-date" className={labelClass}>
              Date *
            </label>
            <input
              id="ws-date"
              type="date"
              {...register("date")}
              className={inputClass}
            />
            {errors.date && <p className={errorClass}>{errors.date.message}</p>}
          </div>

          {/* Start Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ws-start-time" className={labelClass}>
                Start Time *
              </label>
              <input
                id="ws-start-time"
                type="time"
                {...register("startTime")}
                className={inputClass}
              />
              {errors.startTime && (
                <p className={errorClass}>{errors.startTime.message}</p>
              )}
            </div>

            {/* End Time */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ws-end-time" className={labelClass}>
                End Time *
              </label>
              <input
                id="ws-end-time"
                type="time"
                {...register("endTime")}
                className={inputClass}
              />
              {errors.endTime && (
                <p className={errorClass}>{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ws-location" className={labelClass}>
              Location
            </label>
            <input
              id="ws-location"
              {...register("location")}
              className={inputClass}
              placeholder="Studio 44, Calgary NW"
            />
          </div>

          {/* Price & Seats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ws-price" className={labelClass}>
                Price
              </label>
              <input
                id="ws-price"
                type="number"
                min={0}
                {...register("price", { valueAsNumber: true })}
                className={inputClass}
                placeholder="85"
              />
              {errors.price && (
                <p className={errorClass}>{errors.price.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ws-seats" className={labelClass}>
                Available Seats
              </label>
              <input
                id="ws-seats"
                type="number"
                min={0}
                {...register("totalSeats", { valueAsNumber: true })}
                className={inputClass}
              />
              {errors.totalSeats && (
                <p className={errorClass}>{errors.totalSeats.message}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ws-status" className={labelClass}>
              Status
            </label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <select id="ws-status" {...field} className={inputClass}>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              )}
            />
          </div>

          {/* Show to Users */}
          <div className="flex items-center gap-3">
            <input
              id="ws-show"
              type="checkbox"
              {...register("showToUsers")}
              className="w-4 h-4 accent-charcoal cursor-pointer"
            />
            <label htmlFor="ws-show" className={`${labelClass} cursor-pointer`}>
              Show to Users
            </label>
          </div>

          {/* Actions */}
          <div className="mt-3 flex gap-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isPending}
              className="flex-1"
              disabled={isPending}
            >
              {isPending ? "Saving..." : submitLabel}
            </Button>
            <Button
              type="button"
              variant="soft"
              onClick={onClose}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default WorkshopDialog;
