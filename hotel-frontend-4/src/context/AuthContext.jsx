import { create } from 'zustand'
import { storage } from '../utils/storage'

export const useAuthStore = create((set) => ({
  user: storage.getUser(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),

  login: (authResponse) => {
    const { token, ...user } = authResponse
    storage.setToken(token)
    storage.setUser(user)
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    storage.clearAll()
    set({ user: null, token: null, isAuthenticated: false })
  },

  updateUser: (partialUser) => {
    set((state) => {
      const nextUser = { ...state.user, ...partialUser }
      storage.setUser(nextUser)
      return { user: nextUser }
    })
  },
}))
