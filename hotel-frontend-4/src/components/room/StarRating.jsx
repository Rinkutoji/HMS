import { Star } from 'lucide-react'

export default function StarRating({ value = 0, size = 'sm', onChange }) {
  const sizeClass = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5'
  const interactive = typeof onChange === 'function'
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = star <= Math.round(value)
        const Star_ = (
          <Star
            key={star}
            className={`${sizeClass} ${filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
          />
        )
        if (!interactive) return Star_
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            {Star_}
          </button>
        )
      })}
    </div>
  )
}
