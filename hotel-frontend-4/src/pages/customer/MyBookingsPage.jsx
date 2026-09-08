import { useEffect, useState } from 'react'
import { bookingApi } from '../../api/bookingApi'
import BookingCard from '../../components/booking/BookingCard'
import Pagination from '../../components/common/Pagination'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'

export default function MyBookingsPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    bookingApi
      .myBookings({ status: status || undefined, page, size: 8 })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [status, page])

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">My Bookings</h1>
        <select
          className="input w-44"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(0)
          }}
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CHECKED_IN">Checked In</option>
          <option value="CHECKED_OUT">Checked Out</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader />
        ) : data?.content?.length ? (
          <>
            <div className="space-y-3">
              {data.content.map((b) => (
                <BookingCard key={b.id} booking={b} detailPath={`/customer/bookings/${b.id}`} />
              ))}
            </div>
            <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState title="No bookings found" />
        )}
      </div>
    </div>
  )
}
