import axiosClient from './axiosClient'

export const customerApi = {
  getProfile: () => axiosClient.get('/customer/profile'),
  updateProfile: (payload) => axiosClient.put('/customer/profile', payload),
}
