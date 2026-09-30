import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

/**
 * Returns an array of page numbers / ellipsis markers to render.
 */
function buildPageRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < total) pages.add(current + 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);

  const result = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push('ellipsis');
    result.push(p);
    prev = p;
  }
  return result;
}

export default function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 10,
  total = 0,
}) {
  if (totalPages <= 1 && total === 0) return null;

  const rangeStart = Math.min((page - 1) * pageSize + 1, total);
  const rangeEnd = Math.min(page * pageSize, total);

  const pages = buildPageRange(page, totalPages);

  const baseBtn =
    'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-500 h-9 w-9';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-slate-300">
      {/* Results summary */}
      <p className="text-sm text-slate-400 shrink-0">
        {total > 0 ? (
          <>
            Showing{' '}
            <span className="font-semibold text-white">{rangeStart}</span>
            {' – '}
            <span className="font-semibold text-white">{rangeEnd}</span>
            {' of '}
            <span className="font-semibold text-white">{total}</span>
            {' results'}
          </>
        ) : (
          `Page ${page} of ${totalPages}`
        )}
      </p>

      {/* Page controls */}
      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={[
            baseBtn,
            'px-2 border border-white/10 bg-white/5',
            page <= 1
              ? 'text-slate-600 opacity-40 cursor-not-allowed'
              : 'text-slate-300 hover:bg-white/10 hover:text-white',
          ].join(' ')}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex h-9 w-9 items-center justify-center text-slate-500"
              aria-hidden="true"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              className={[
                baseBtn,
                p === page
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white',
              ].join(' ')}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className={[
            baseBtn,
            'px-2 border border-white/10 bg-white/5',
            page >= totalPages
              ? 'text-slate-600 opacity-40 cursor-not-allowed'
              : 'text-slate-300 hover:bg-white/10 hover:text-white',
          ].join(' ')}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
