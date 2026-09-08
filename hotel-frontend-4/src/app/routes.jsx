import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './protectedRoutes'

import PublicLayout from '../layouts/PublicLayout'
import CustomerLayout from '../layouts/CustomerLayout'
import StaffLayout from '../layouts/StaffLayout'
import AdminLayout from '../layouts/AdminLayout'

import HomePage from '../pages/public/HomePage'
import CustomerLoginPage from '../pages/public/CustomerLoginPage'
import CustomerRegisterPage from '../pages/public/CustomerRegisterPage'
import StaffAdminLoginPage from '../pages/public/StaffAdminLoginPage'
import RoomListPage from '../pages/public/RoomListPage'
import RoomDetailPage from '../pages/public/RoomDetailPage'

import CustomerDashboardPage from '../pages/customer/DashboardPage'
import CustomerProfilePage from '../pages/customer/ProfilePage'
import MyBookingsPage from '../pages/customer/MyBookingsPage'
import BookingDetailPage from '../pages/customer/BookingDetailPage'
import PaymentHistoryPage from '../pages/customer/PaymentHistoryPage'
import SavedRoomsPage from '../pages/customer/SavedRoomsPage'

import StaffDashboardPage from '../pages/staff/DashboardPage'
import BookingManagementPage from '../pages/staff/BookingManagementPage'
import CheckInPage from '../pages/staff/CheckInPage'
import CheckOutPage from '../pages/staff/CheckOutPage'
import StaffCustomerListPage from '../pages/staff/CustomerListPage'
import StaffPaymentListPage from '../pages/staff/PaymentListPage'
import StaffPaymentQrCodesPage from '../pages/staff/PaymentQrCodesPage'

import AdminDashboardPage from '../pages/admin/DashboardPage'
import RoomTypePage from '../pages/admin/RoomTypePage'
import RoomPage from '../pages/admin/RoomPage'
import RoomImagePage from '../pages/admin/RoomImagePage'
import AdminBookingPage from '../pages/admin/BookingPage'
import AdminPaymentPage from '../pages/admin/PaymentPage'
import AdminCustomerPage from '../pages/admin/CustomerPage'
import AdminStaffPage from '../pages/admin/StaffPage'
import HotelImagePage from '../pages/admin/HotelImagePage'
import ReportPage from '../pages/admin/ReportPage'
import AdminPaymentQrCodesPage from '../pages/admin/PaymentQrCodesPage'

import NotFoundPage from '../pages/public/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/rooms/:id" element={<RoomDetailPage />} />
        <Route path="/login" element={<CustomerLoginPage />} />
        <Route path="/register" element={<CustomerRegisterPage />} />
        <Route path="/staff-login" element={<StaffAdminLoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Customer */}
      <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
        <Route element={<CustomerLayout />}>
          <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
          <Route path="/customer/bookings" element={<MyBookingsPage />} />
          <Route path="/customer/bookings/:id" element={<BookingDetailPage />} />
          <Route path="/customer/saved-rooms" element={<SavedRoomsPage />} />
          <Route path="/customer/payments" element={<PaymentHistoryPage />} />
          <Route path="/customer/profile" element={<CustomerProfilePage />} />
        </Route>
      </Route>

      {/* Staff (and Admin, who share staff-level access on the backend) */}
      <Route element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']} />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
          <Route path="/staff/bookings" element={<BookingManagementPage />} />
          <Route path="/staff/check-in" element={<CheckInPage />} />
          <Route path="/staff/check-out" element={<CheckOutPage />} />
          <Route path="/staff/customers" element={<StaffCustomerListPage />} />
          <Route path="/staff/payments" element={<StaffPaymentListPage />} />
          <Route path="/staff/qr-codes" element={<StaffPaymentQrCodesPage />} />
        </Route>
      </Route>

      {/* Admin only */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/room-types" element={<RoomTypePage />} />
          <Route path="/admin/rooms" element={<RoomPage />} />
          <Route path="/admin/rooms/:id/images" element={<RoomImagePage />} />
          <Route path="/admin/bookings" element={<AdminBookingPage />} />
          <Route path="/admin/payments" element={<AdminPaymentPage />} />
          <Route path="/admin/qr-codes" element={<AdminPaymentQrCodesPage />} />
          <Route path="/admin/customers" element={<AdminCustomerPage />} />
          <Route path="/admin/staff" element={<AdminStaffPage />} />
          <Route path="/admin/hotel-images" element={<HotelImagePage />} />
          <Route path="/admin/reports" element={<ReportPage />} />
        </Route>
      </Route>
    </Routes>
  )
}