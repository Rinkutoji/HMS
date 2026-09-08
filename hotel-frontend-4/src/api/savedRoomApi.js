import axiosClient from './axiosClient'

export const savedRoomApi = {
  listMine: () => axiosClient.get('/customer/saved-rooms'),
  listMyRoomIds: () => axiosClient.get('/customer/saved-rooms/ids'),
  save: (roomId) => axiosClient.post(`/customer/saved-rooms/${roomId}`),
  unsave: (roomId) => axiosClient.delete(`/customer/saved-rooms/${roomId}`),
}
