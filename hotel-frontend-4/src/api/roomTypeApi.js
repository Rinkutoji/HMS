import axiosClient from './axiosClient'

export const roomTypeApi = {
  listPublic: () => axiosClient.get('/public/room-types'),
  getPublic: (id) => axiosClient.get(`/public/room-types/${id}`),

  listAdmin: () => axiosClient.get('/admin/room-types'),
  getAdmin: (id) => axiosClient.get(`/admin/room-types/${id}`),
  create: (payload) => axiosClient.post('/admin/room-types', payload),
  update: (id, payload) => axiosClient.put(`/admin/room-types/${id}`, payload),
  remove: (id) => axiosClient.delete(`/admin/room-types/${id}`),
}
