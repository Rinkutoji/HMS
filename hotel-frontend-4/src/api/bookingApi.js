import axiosClient from './axiosClient'

export const bookingApi = {
  // Customer
  create: (payload) => axiosClient.post('/customer/bookings', payload),
  myBookings: (params) => axiosClient.get('/customer/bookings', { params }),
  myBookingDetail: (id) => axiosClient.get(`/customer/bookings/${id}`),
  cancelMine: (id) => axiosClient.patch(`/customer/bookings/${id}/cancel`),

  // Staff / Admin
  search: (params) => axiosClient.get('/staff/bookings', { params }),
  getById: (id) => axiosClient.get(`/staff/bookings/${id}`),
  confirm: (id) => axiosClient.patch(`/staff/bookings/${id}/confirm`),
  checkIn: (id) => axiosClient.patch(`/staff/bookings/${id}/check-in`),
  checkOut: (id) => axiosClient.patch(`/staff/bookings/${id}/check-out`),
  cancelByStaff: (id) => axiosClient.patch(`/staff/bookings/${id}/cancel`),
}
