import { X } from 'lucide-react'

export default function ImagePreview({ src, onRemove }) {
  return (
    <div className="group relative h-24 w-24 overflow-hidden rounded-lg border border-slate-200">
      <img src={src} alt="" className="h-full w-full object-cover" />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1 top-1 rounded-full bg-slate-900/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Remove image"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
