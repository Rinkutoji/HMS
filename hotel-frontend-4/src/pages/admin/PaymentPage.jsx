import { useCallback, useEffect, useState } from 'react'
import { paymentApi } from '../../api/paymentApi'
import PaymentStatus from '../../components/payment/PaymentStatus'
import PaymentPreview from '../../components/payment/PaymentPreview'
import Modal from '../../components/common/Modal'
import Pagination from '../../components/common/Pagination'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

export default function PaymentPage() {
  const [status, setStatus] = useState('PENDING')
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [actioning, setActioning] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    paymentApi
      .search({ status: status || undefined, page, size: 10 })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [status, page])

  useEffect(() => {
    load()
  }, [load])

  const handleVerify = async () => {
    setActioning(true)
    try {
      await paymentApi.verify(selected.id)
      setSelected(null)
      load()
    } finally {
      setActioning(false)
    }
  }

  const handleReject = async () => {
    setActioning(true)
    try {
      await paymentApi.reject(selected.id)
      setSelected(null)
      load()
    } finally {
      setActioning(false)
    }
  }

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
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">Booking #{p.bookingId}</p>
                    <p className="text-xs text-slate-400">{formatDate(p.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-700">{formatCurrency(p.amount)}</span>
                    <PaymentStatus status={p.status} />
                  </div>
                </button>
              ))}
            </div>
            <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState title="No payments found" />
        )}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Payment for Booking #${selected?.bookingId}`}
        footer={
          selected?.status === 'PENDING' && (
            <>
              <button className="btn-danger" onClick={handleReject} disabled={actioning}>
                Reject
              </button>
              <button className="btn-primary" onClick={handleVerify} disabled={actioning}>
                Verify
              </button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Amount</span>
              <span className="font-medium text-slate-800">{formatCurrency(selected.amount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <PaymentStatus status={selected.status} />
            </div>
            <PaymentPreview imageUrl={selected.receiptImageUrl} />
          </div>
        )}
      </Modal>
    </div>
  )
}
