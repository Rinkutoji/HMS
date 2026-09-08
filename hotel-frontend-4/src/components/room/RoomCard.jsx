import { Link } from 'react-router-dom'
import { Users, BedDouble } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { useSavedRooms } from '../../hooks/useSavedRooms'
import SaveButton from './SaveButton'
import StarRating from './StarRating'

export default function RoomCard({ room }) {
  const image = room.images?.[0]?.imageUrl
  const { isSaved, setSaved } = useSavedRooms()
  const saved = isSaved(room.id)

  return (
    <Link
      to={`/rooms/${room.id}`}
      className="card group overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={room.roomTypeName}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <BedDouble className="h-10 w-10" />
          </div>
        )}
        <SaveButton
          roomId={room.id}
          saved={saved}
          onChange={(next) => setSaved(room.id, next)}
          className="absolute right-3 top-3"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">{room.roomTypeName}</h3>
          <span className="text-xs font-medium text-slate-400">#{room.roomNumber}</span>
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          {room.reviewCount > 0 ? (
            <>
              <StarRating value={room.averageRating} />
              <span className="text-xs text-slate-400">
                {room.averageRating} ({room.reviewCount})
              </span>
            </>
          ) : (
            <span className="text-xs text-slate-400">No reviews yet</span>
          )}
        </div>

        <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500">
          <Users className="h-3.5 w-3.5" />
          Up to {room.capacity} guests
        </p>
        <p className="mt-3 text-lg font-semibold text-brand-800">
          {formatCurrency(room.basePrice)}
          <span className="text-sm font-normal text-slate-400"> / night</span>
        </p>
      </div>
    </Link>
  )
}