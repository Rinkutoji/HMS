// Centralized path constants, kept separate from routes.jsx (which defines
// the actual <Route> tree) so links/redirects elsewhere in the app don't
// hardcode path strings.
export const ROUTES = {
  home: '/',
  rooms: '/rooms',
  roomDetail: (id = ':id') => `/rooms/${id}`,
  login: '/login',
  register: '/register',
  staffAdminLogin: '/staff-login',

  customerDashboard: '/customer/dashboard',
  customerBookings: '/customer/bookings',
  customerBookingDetail: (id = ':id') => `/customer/bookings/${id}`,
  customerPayments: '/customer/payments',
  customerProfile: '/customer/profile',

  staffDashboard: '/staff/dashboard',
  staffBookings: '/staff/bookings',
  staffCheckIn: '/staff/check-in',
  staffCheckOut: '/staff/check-out',
  staffCustomers: '/staff/customers',
  staffPayments: '/staff/payments',

  adminDashboard: '/admin/dashboard',
  adminRoomTypes: '/admin/room-types',
  adminRooms: '/admin/rooms',
  adminRoomImages: (id = ':id') => `/admin/rooms/${id}/images`,
  adminBookings: '/admin/bookings',
  adminPayments: '/admin/payments',
  adminCustomers: '/admin/customers',
  adminStaff: '/admin/staff',
  adminHotelImages: '/admin/hotel-images',
  adminReports: '/admin/reports',
}
