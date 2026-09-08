import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ pageNumber, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        className="btn-ghost h-9 w-9 p-0"
        onClick={() => onPageChange(pageNumber - 1)}
        disabled={pageNumber <= 0}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm text-slate-600">
        Page {pageNumber + 1} of {totalPages}
      </span>
      <button
        className="btn-ghost h-9 w-9 p-0"
        onClick={() => onPageChange(pageNumber + 1)}
        disabled={pageNumber >= totalPages - 1}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
