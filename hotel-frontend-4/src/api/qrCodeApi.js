import axiosClient from './axiosClient'

export const qrCodeApi = {
  // Public (customer-facing)
  listPublic: () => axiosClient.get('/public/payment-qr-codes'),

  // Staff / Admin (both roles can manage)
  listAll: () => axiosClient.get('/staff/qr-codes'),
  upload: (bankName, file) => {
    const formData = new FormData()
    formData.append('bankName', bankName)
    formData.append('file', file)
    return axiosClient.post('/staff/qr-codes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  activate: (id) => axiosClient.patch(`/staff/qr-codes/${id}/activate`),
  deactivate: (id) => axiosClient.patch(`/staff/qr-codes/${id}/deactivate`),
  remove: (id) => axiosClient.delete(`/staff/qr-codes/${id}`),
}
