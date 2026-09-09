import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  LogIn,
  LogOut as LogOutIcon,
  Users,
  CreditCard,
  QrCode,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const items = [
  {
    to: "/staff/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  { to: "/staff/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/staff/check-in", label: "Check In", icon: LogIn },
  { to: "/staff/check-out", label: "Check Out", icon: LogOutIcon },
  { to: "/staff/customers", label: "Customers", icon: Users },
  { to: "/staff/payments", label: "Payments", icon: CreditCard },
  { to: "/staff/qr-codes", label: "QR Codes", icon: QrCode },
];

export default function StaffLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <Sidebar title="Staff Panel" items={items} />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
