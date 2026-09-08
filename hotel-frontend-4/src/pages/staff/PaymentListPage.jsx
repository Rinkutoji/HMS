import { useEffect, useState } from 'react'
import { paymentApi } from '../../api/paymentApi'
import PaymentStatus from '../../components/payment/PaymentStatus'
import Pagination from '../../components/common/Pagination'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

export default function PaymentListPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    paymentApi
      .search({ status: status || undefined, page, size: 10 })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [status, page])

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Payments</h1>
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
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader />
        ) : data?.content?.length ? (
          <>
            <div className="card divide-y divide-slate-100">
              {data.content.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Booking #{p.bookingId}</p>
                    <p className="text-xs text-slate-400">{formatDate(p.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-700">{formatCurrency(p.amount)}</span>
                    <PaymentStatus status={p.status} />
                  </div>
                </div>
              ))}
            </div>
            <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState title="No payments found" />
        )}
      </div>
    </div>
  )
}
