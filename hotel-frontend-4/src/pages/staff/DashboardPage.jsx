import { useEffect, useState } from 'react'
import { CalendarPlus, LogIn, LogOut as LogOutIcon } from 'lucide-react'
import { dashboardApi } from '../../api/dashboardApi'
import Loader from '../../components/common/Loader'
import StatCard from '../../components/dashboard/StatCard'
import SummaryCards from '../../components/dashboard/SummaryCards'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi
      .staff()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader className="py-24" />
  if (!data) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Staff Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Today at a glance.</p>
      </div>

      <SummaryCards>
        <StatCard label="Today's Bookings" value={data.todaysBookings} icon={CalendarPlus} />
        <StatCard label="Today's Check-ins" value={data.todaysCheckIns} icon={LogIn} />
        <StatCard label="Today's Check-outs" value={data.todaysCheckOuts} icon={LogOutIcon} />
      </SummaryCards>
    </div>
  )
}
