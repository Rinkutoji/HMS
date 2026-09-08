import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  BedDouble,
  DoorOpen,
  CalendarCheck,
  CreditCard,
  Users,
  UserCog,
  Image,
  FileBarChart,
  QrCode,
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'

const items = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/room-types', label: 'Room Types', icon: BedDouble },
  { to: '/admin/rooms', label: 'Rooms', icon: DoorOpen },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/qr-codes', label: 'QR Codes', icon: QrCode },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/staff', label: 'Staff', icon: UserCog },
  { to: '/admin/hotel-images', label: 'Hotel Images', icon: Image },
  { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <Sidebar title="Admin Panel" items={items} />
        <main className="flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
