import axiosClient from './axiosClient'

export const roomApi = {
  search: (params) => axiosClient.get('/public/rooms', { params }),
  getPublic: (id) => axiosClient.get(`/public/rooms/${id}`),

  getAdmin: (id) => axiosClient.get(`/admin/rooms/${id}`),
  create: (payload) => axiosClient.post('/admin/rooms', payload),
  update: (id, payload) => axiosClient.put(`/admin/rooms/${id}`, payload),
  remove: (id) => axiosClient.delete(`/admin/rooms/${id}`),

  uploadImages: (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    return axiosClient.post(`/admin/rooms/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteImage: (id, imageId) => axiosClient.delete(`/admin/rooms/${id}/images/${imageId}`),
}
