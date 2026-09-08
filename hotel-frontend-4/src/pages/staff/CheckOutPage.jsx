import { useCallback, useEffect, useState } from 'react'
import { bookingApi } from '../../api/bookingApi'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { formatDate } from '../../utils/formatDate'

export default function CheckOutPage() {
  const [bookings, setBookings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    bookingApi
      .search({ status: 'CHECKED_IN', size: 20 })
      .then((res) => setBookings(res.data.content))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleCheckOut = async (id) => {
    setActioning(id)
    try {
      await bookingApi.checkOut(id)
      load()
    } finally {
      setActioning(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Check Out</h1>
      <p className="mt-1 text-sm text-slate-500">Guests currently checked in.</p>

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
                    {b.roomTypeName} #{b.roomNumber} &middot; out {formatDate(b.checkOutDate)}
                  </p>
                </div>
                <button
                  className="btn-primary"
                  disabled={actioning === b.id}
                  onClick={() => handleCheckOut(b.id)}
                >
                  {actioning === b.id ? 'Checking out...' : 'Check Out'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No guests to check out" />
        )}
      </div>
    </div>
  )
}
