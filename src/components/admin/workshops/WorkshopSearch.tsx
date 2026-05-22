interface WorkshopSearchProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export default function WorkshopSearch({
  value,
  onChange,
}: WorkshopSearchProps) {
  return (
    <div className="mb-8 max-w-sm">
      <input
        type="text"
        placeholder="Search workshops…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-light-gray text-[14px] outline-none focus:border-gold transition-colors duration-200 bg-white"
      />
    </div>
  );
}
