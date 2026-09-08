import { useEffect, useState } from 'react'
import { CalendarCheck, CreditCard, User as UserIcon } from 'lucide-react'
import { dashboardApi } from '../../api/dashboardApi'
import Loader from '../../components/common/Loader'
import StatCard from '../../components/dashboard/StatCard'
import SummaryCards from '../../components/dashboard/SummaryCards'
import BookingCard from '../../components/booking/BookingCard'
import PaymentStatus from '../../components/payment/PaymentStatus'
import { formatCurrency } from '../../utils/formatCurrency'
import EmptyState from '../../components/common/EmptyState'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi
      .customer()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader className="py-24" />
  if (!data) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Welcome back, {data.profile.firstName}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here&apos;s a summary of your account.</p>
      </div>

      <SummaryCards>
        <StatCard label="Total Bookings" value={data.totalBookings} icon={CalendarCheck} />
        <StatCard label="Recent Receipts" value={data.recentPayments.length} icon={CreditCard} />
        <StatCard label="Account" value={data.profile.active ? 'Active' : 'Inactive'} icon={UserIcon} />
      </SummaryCards>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Recent Bookings</h2>
        {data.recentBookings.length ? (
          <div className="space-y-3">
            {data.recentBookings.map((b) => (
              <BookingCard key={b.id} booking={b} detailPath={`/customer/bookings/${b.id}`} />
            ))}
          </div>
        ) : (
          <EmptyState title="No bookings yet" description="Browse rooms to make your first booking." />
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Recent Payments</h2>
        {data.recentPayments.length ? (
          <div className="card divide-y divide-slate-100">
            {data.recentPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-slate-600">Booking #{p.bookingId}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-800">{formatCurrency(p.amount)}</span>
                  <PaymentStatus status={p.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No payments yet" />
        )}
      </div>
    </div>
  )
}
