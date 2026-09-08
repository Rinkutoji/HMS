import { Users, BedDouble, Info } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import StarRating from './StarRating'

export default function RoomDetails({ room }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{room.roomTypeName}</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-800">Room {room.roomNumber}</h1>
      </div>

      <div className="flex items-center gap-2">
        {room.reviewCount > 0 ? (
          <>
            <StarRating value={room.averageRating} size="md" />
            <span className="text-sm text-slate-500">
              {room.averageRating} &middot; {room.reviewCount} review{room.reviewCount > 1 ? 's' : ''}
            </span>
          </>
        ) : (
          <span className="text-sm text-slate-400">No reviews yet</span>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          Up to {room.capacity} guests
        </span>
        {room.floor != null && (
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" />
            Floor {room.floor}
          </span>
        )}
      </div>

      {room.description && (
        <p className="flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          {room.description}
        </p>
      )}

      <p className="text-2xl font-semibold text-brand-800">
        {formatCurrency(room.basePrice)}
        <span className="text-sm font-normal text-slate-400"> / night</span>
      </p>
    </div>
  )
}