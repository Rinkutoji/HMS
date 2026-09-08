import axiosClient from './axiosClient'

export const paymentApi = {
  // Customer
  myPayments: (params) => axiosClient.get('/customer/payments', { params }),
  getMyStatus: (bookingId) => axiosClient.get(`/customer/payments/${bookingId}`),
  uploadReceipt: (bookingId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axiosClient.post(`/customer/payments/${bookingId}/receipt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Staff (view only)
  search: (params) => axiosClient.get('/staff/payments', { params }),
  getById: (id) => axiosClient.get(`/staff/payments/${id}`),

  // Admin
  verify: (id) => axiosClient.patch(`/admin/payments/${id}/verify`),
  reject: (id) => axiosClient.patch(`/admin/payments/${id}/reject`),
}
