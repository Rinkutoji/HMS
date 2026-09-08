import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import BookingStatusBadge from './BookingStatusBadge'

export default function BookingCard({ booking, detailPath }) {
  return (
    <Link to={detailPath} className="card flex flex-col gap-3 p-4 transition-shadow hover:shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-slate-800">
          {booking.roomTypeName} &middot; Room {booking.roomNumber}
        </p>
        <p className="mt-0.5 text-sm text-slate-500">
          {formatDate(booking.checkInDate)} &rarr; {formatDate(booking.checkOutDate)}
        </p>
        {booking.customerName && (
          <p className="mt-0.5 text-xs text-slate-400">Guest: {booking.customerName}</p>
        )}
      </div>
      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
        <BookingStatusBadge status={booking.status} />
        <span className="font-semibold text-slate-800">{formatCurrency(booking.totalPrice)}</span>
      </div>
    </Link>
  )
}
