import axiosClient from './axiosClient'

export const dashboardApi = {
  admin: () => axiosClient.get('/admin/dashboard'),
  staff: () => axiosClient.get('/staff/dashboard'),
  customer: () => axiosClient.get('/customer/dashboard'),
}
