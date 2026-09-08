import { useCallback, useEffect, useState } from 'react'
import { bookingApi } from '../../api/bookingApi'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { formatDate } from '../../utils/formatDate'

const today = () => new Date().toISOString().split('T')[0]

export default function CheckInPage() {
  const [bookings, setBookings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    bookingApi
      .search({ status: 'CONFIRMED', checkInDate: today(), size: 20 })
      .then((res) => setBookings(res.data.content))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleCheckIn = async (id) => {
    setActioning(id)
    try {
      await bookingApi.checkIn(id)
      load()
    } finally {
      setActioning(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Check In</h1>
      <p className="mt-1 text-sm text-slate-500">Confirmed bookings arriving today.</p>

      <div className="mt-5">
        {loading ? (
          <Loader />
        ) : bookings?.length ? (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="card flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-slate-800">{b.customerName}</p>
                  <p className="text-sm text-slate-500">
                    {b.roomTypeName} #{b.roomNumber} &middot; {formatDate(b.checkInDate)}
                  </p>
                </div>
                <button
                  className="btn-primary"
                  disabled={actioning === b.id}
                  onClick={() => handleCheckIn(b.id)}
                >
                  {actioning === b.id ? 'Checking in...' : 'Check In'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No arrivals today" />
        )}
      </div>
    </div>
  )
}
