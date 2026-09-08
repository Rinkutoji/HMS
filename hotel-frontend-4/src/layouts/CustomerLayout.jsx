import { Outlet } from 'react-router-dom'
import { LayoutDashboard, CalendarCheck, CreditCard, UserCircle, Heart } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'

const items = [
  { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/customer/bookings', label: 'My Bookings', icon: CalendarCheck },
  { to: '/customer/saved-rooms', label: 'Saved Rooms', icon: Heart },
  { to: '/customer/payments', label: 'Payment History', icon: CreditCard },
  { to: '/customer/profile', label: 'Profile', icon: UserCircle },
]

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <Sidebar title="My Account" items={items} />
        <main className="flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}