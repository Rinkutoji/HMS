import { useAuthStore } from '../context/AuthContext'

export function useAuth() {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore()
  return {
    user,
    token,
    isAuthenticated,
    role: user?.role ?? null,
    login,
    logout,
    updateUser,
  }
}
