export const BOOKING_STATUS = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  CHECKED_IN: { label: 'Checked In', color: 'bg-emerald-100 text-emerald-800' },
  CHECKED_OUT: { label: 'Checked Out', color: 'bg-slate-200 text-slate-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
}

export const PAYMENT_STATUS = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  VERIFIED: { label: 'Verified', color: 'bg-emerald-100 text-emerald-800' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
}

export const ROOM_STATUS = {
  AVAILABLE: { label: 'Available', color: 'bg-emerald-100 text-emerald-800' },
  MAINTENANCE: { label: 'Maintenance', color: 'bg-amber-100 text-amber-800' },
}

export const ROOM_TYPES_HINT = ['Standard Room', 'Deluxe Room', 'Family Room', 'VIP Room']
