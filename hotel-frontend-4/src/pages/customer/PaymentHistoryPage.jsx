import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { paymentApi } from '../../api/paymentApi'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import PaymentStatus from '../../components/payment/PaymentStatus'
import Pagination from '../../components/common/Pagination'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'

export default function PaymentHistoryPage() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    paymentApi
      .myPayments({ page, size: 10 })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Payment History</h1>

      <div className="mt-5">
        {loading ? (
          <Loader />
        ) : data?.content?.length ? (
          <>
            <div className="card divide-y divide-slate-100">
              {data.content.map((p) => (
                <Link
                  key={p.id}
                  to={`/customer/bookings/${p.bookingId}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">Booking #{p.bookingId}</p>
                    <p className="text-xs text-slate-400">{formatDate(p.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">{formatCurrency(p.amount)}</span>
                    <PaymentStatus status={p.status} />
                  </div>
                </Link>
              ))}
            </div>
            <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState title="No payments yet" description="Receipts you submit will show up here." />
        )}
      </div>
    </div>
  )
}
