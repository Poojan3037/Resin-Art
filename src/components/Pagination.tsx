import Link from "next/link";
import clsx from "clsx";

type PropsType = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

const Pagination = ({ currentPage, totalPages, basePath }: PropsType) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-2 flex-wrap"
    >
      <Link
        href={`${basePath}?page=${currentPage - 1}`}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
        className={clsx(
          "px-4 py-2 text-[12px] tracking-[0.1em] uppercase border border-light-gray transition-colors",
          currentPage <= 1
            ? "pointer-events-none opacity-40"
            : "text-charcoal hover:border-gold hover:text-gold",
        )}
      >
        Previous
      </Link>

      {pages.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={`${basePath}?page=${pageNumber}`}
          className={clsx(
            "min-w-9 h-9 flex items-center justify-center text-[13px] border transition-colors",
            pageNumber === currentPage
              ? "border-gold text-gold"
              : "border-light-gray text-charcoal hover:border-gold hover:text-gold",
          )}
        >
          {pageNumber}
        </Link>
      ))}

      <Link
        href={`${basePath}?page=${currentPage + 1}`}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
        className={clsx(
          "px-4 py-2 text-[12px] tracking-[0.1em] uppercase border border-light-gray transition-colors",
          currentPage >= totalPages
            ? "pointer-events-none opacity-40"
            : "text-charcoal hover:border-gold hover:text-gold",
        )}
      >
        Next
      </Link>
    </nav>
  );
};

export default Pagination;
