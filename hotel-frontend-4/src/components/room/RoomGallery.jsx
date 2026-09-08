import { useState } from 'react'
import { BedDouble, ChevronLeft, ChevronRight } from 'lucide-react'

export default function RoomGallery({ images = [], alt }) {
  const [active, setActive] = useState(0)

  if (!images.length) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-slate-100 text-slate-300">
        <BedDouble className="h-14 w-14" />
      </div>
    )
  }

  const next = () => setActive((i) => (i + 1) % images.length)
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length)

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
        <img src={images[active]} alt={alt} className="h-full w-full object-cover" />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === active ? 'border-brand-600' : 'border-transparent'
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
