import { useCallback, useEffect, useState } from 'react'
import { bookingApi } from '../../api/bookingApi'
import BookingFilter from '../../components/booking/BookingFilter'
import BookingStatusBadge from '../../components/booking/BookingStatusBadge'
import Pagination from '../../components/common/Pagination'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

export default function BookingManagementPage() {
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    bookingApi
      .search({ ...filters, page, size: 10 })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [filters, page])

  useEffect(() => {
    load()
  }, [load])

  const runAction = async (action, id) => {
    setActioning(id)
    try {
      await action(id)
      load()
    } finally {
      setActioning(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Bookings</h1>

      <div className="mt-5">
        <BookingFilter
          filters={filters}
          onChange={(next) => {
            setFilters(next)
            setPage(0)
          }}
        />
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader />
        ) : data?.content?.length ? (
          <>
            <div className="card overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Guest</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.content.map((b) => (
                    <tr key={b.id}>
                      <td className="px-4 py-3">{b.customerName}</td>
                      <td className="px-4 py-3">
                        {b.roomTypeName} #{b.roomNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(b.checkInDate)} - {formatDate(b.checkOutDate)}
                      </td>
                      <td className="px-4 py-3">{formatCurrency(b.totalPrice)}</td>
                      <td className="px-4 py-3">
                        <BookingStatusBadge status={b.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {b.status === 'PENDING' && (
                            <button
                              className="btn-ghost h-8 px-2 text-xs"
                              disabled={actioning === b.id}
                              onClick={() => runAction(bookingApi.confirm, b.id)}
                            >
                              Confirm
                            </button>
                          )}
                          {b.status === 'CONFIRMED' && (
                            <button
                              className="btn-ghost h-8 px-2 text-xs"
                              disabled={actioning === b.id}
                              onClick={() => runAction(bookingApi.checkIn, b.id)}
                            >
                              Check In
                            </button>
                          )}
                          {b.status === 'CHECKED_IN' && (
                            <button
                              className="btn-ghost h-8 px-2 text-xs"
                              disabled={actioning === b.id}
                              onClick={() => runAction(bookingApi.checkOut, b.id)}
                            >
                              Check Out
                            </button>
                          )}
                          {['PENDING', 'CONFIRMED'].includes(b.status) && (
                            <button
                              className="btn-ghost h-8 px-2 text-xs text-red-600"
                              disabled={actioning === b.id}
                              onClick={() => runAction(bookingApi.cancelByStaff, b.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
