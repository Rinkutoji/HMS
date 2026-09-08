import axiosClient from './axiosClient'

export const authApi = {
  customerRegister: (payload) => axiosClient.post('/customer/auth/register', payload),
  customerLogin: (payload) => axiosClient.post('/customer/auth/login', payload),
  staffAdminLogin: (payload) => axiosClient.post('/admin/auth/login', payload),
}
