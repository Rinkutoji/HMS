import axiosClient from './axiosClient'

export const reviewApi = {
  listByRoom: (roomId, params) => axiosClient.get(`/public/rooms/${roomId}/reviews`, { params }),
  getRoomSummary: (roomId) => axiosClient.get(`/public/rooms/${roomId}/reviews/summary`),
  getMyReview: (bookingId) => axiosClient.get(`/customer/bookings/${bookingId}/review`),
  createReview: (bookingId, payload) => axiosClient.post(`/customer/bookings/${bookingId}/review`, payload),
  updateReview: (bookingId, payload) => axiosClient.put(`/customer/bookings/${bookingId}/review`, payload),
}
