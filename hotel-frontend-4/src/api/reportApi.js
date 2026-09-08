import axiosClient from './axiosClient'

export const reportApi = {
  revenue: (from, to) => axiosClient.get('/admin/reports/revenue', { params: { from, to } }),
}
