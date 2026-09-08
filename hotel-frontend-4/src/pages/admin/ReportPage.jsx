import { useState } from 'react'
import { reportApi } from '../../api/reportApi'
import RevenueChart from '../../components/dashboard/RevenueChart'
import BookingChart from '../../components/dashboard/BookingChart'
import Loader from '../../components/common/Loader'
import { formatCurrency } from '../../utils/formatCurrency'

function firstOfMonth() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
}

function today() {
  return new Date().toISOString().split('T')[0]
}

export default function ReportPage() {
  const [from, setFrom] = useState(firstOfMonth())
  const [to, setTo] = useState(today())
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runReport = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await reportApi.revenue(from, to)
      setReport(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Revenue Report</h1>

      <div className="card mt-5 flex flex-wrap items-end gap-4 p-4">
        <div>
          <label className="label">From</label>
          <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="label">To</label>
          <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={runReport} disabled={loading}>
          {loading ? 'Running...' : 'Run Report'}
        </button>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading && <Loader className="mt-6" />}

      {report && !loading && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total Bookings</p>
              <p className="mt-1 text-xl font-semibold text-slate-800">{report.totalBookings}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total Revenue</p>
              <p className="mt-1 text-xl font-semibold text-slate-800">{formatCurrency(report.totalRevenue)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card p-5">
              <h2 className="mb-2 text-sm font-semibold text-slate-800">Revenue by Room Type</h2>
              <RevenueChart data={report.revenueByRoomType} />
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-sm font-semibold text-slate-800">Bookings by Status</h2>
              <BookingChart data={report.bookingsByStatus} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
