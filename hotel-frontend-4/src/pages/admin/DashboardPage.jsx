import { useEffect, useState } from 'react'
import { DoorOpen, Users, CalendarCheck, DollarSign } from 'lucide-react'
import { dashboardApi } from '../../api/dashboardApi'
import Loader from '../../components/common/Loader'
import StatCard from '../../components/dashboard/StatCard'
import SummaryCards from '../../components/dashboard/SummaryCards'
import RevenueChart from '../../components/dashboard/RevenueChart'
import BookingChart from '../../components/dashboard/BookingChart'
import { formatCurrency } from '../../utils/formatCurrency'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi
      .admin()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader className="py-24" />
  if (!data) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of hotel performance.</p>
      </div>

      <SummaryCards>
        <StatCard label="Total Rooms" value={data.totalRooms} icon={DoorOpen} />
        <StatCard label="Total Customers" value={data.totalCustomers} icon={Users} />
        <StatCard label="Total Bookings" value={data.totalBookings} icon={CalendarCheck} />
        <StatCard label="Total Revenue" value={formatCurrency(data.totalRevenue)} icon={DollarSign} />
      </SummaryCards>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-2 text-sm font-semibold text-slate-800">Revenue by Room Type</h2>
          <RevenueChart data={data.revenueByRoomType} />
        </div>
        <div className="card p-5">
          <h2 className="mb-2 text-sm font-semibold text-slate-800">Bookings by Status</h2>
          <BookingChart data={data.bookingsByStatus} />
        </div>
      </div>

      <div className="card p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-800">Bookings by Room Type</h2>
        <BookingChart data={data.bookingsByRoomType} />
      </div>
    </div>
  )
}
