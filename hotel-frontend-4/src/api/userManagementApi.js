import axiosClient from './axiosClient'

export const userManagementApi = {
  staffViewCustomers: (params) => axiosClient.get('/staff/customers', { params }),

  adminListCustomers: (params) => axiosClient.get('/admin/customers', { params }),
  adminActivateCustomer: (id) => axiosClient.patch(`/admin/customers/${id}/activate`),
  adminDeactivateCustomer: (id) => axiosClient.patch(`/admin/customers/${id}/deactivate`),

  adminListStaff: (params) => axiosClient.get('/admin/staff', { params }),
  adminCreateStaff: (payload) => axiosClient.post('/admin/staff', payload),
  adminActivateStaff: (id) => axiosClient.patch(`/admin/staff/${id}/activate`),
  adminDeactivateStaff: (id) => axiosClient.patch(`/admin/staff/${id}/deactivate`),
}
