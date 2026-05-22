import PlusIcon from "@/components/icons/PlusIcon";

type PropsType = {
  readonly count: number;
  readonly onAdd: () => void;
};

const WorkshopHeader = ({ count, onAdd }: PropsType) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div>
        <span className="text-[11px] tracking-[0.22em] uppercase text-gold">
          Manage
        </span>
        <h1 className="text-[clamp(28px,4vw,44px)] font-semibold text-charcoal mt-1">
          Workshops
        </h1>
        <p className="text-[13px] text-gray mt-1">
          {count} workshop{count === 1 ? "" : "s"} scheduled
        </p>
      </div>
      <button
        onClick={onAdd}
        className="self-start sm:self-auto bg-charcoal text-gold-light px-6 py-3.5 text-[14px] tracking-[0.12em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-300 flex gap-2 items-center"
      >
        <PlusIcon /> Add Workshop
      </button>
    </div>
  );
};

export default WorkshopHeader;
