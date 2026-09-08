import axiosClient from './axiosClient'

export const imageApi = {
  listPublic: () => axiosClient.get('/public/hotel-images'),
  upload: (files, caption) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    if (caption) formData.append('caption', caption)
    return axiosClient.post('/admin/hotel-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  remove: (id) => axiosClient.delete(`/admin/hotel-images/${id}`),
}
