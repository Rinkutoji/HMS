import { useCallback, useEffect, useState } from 'react'
import { savedRoomApi } from '../api/savedRoomApi'
import { useAuth } from './useAuth'

export function useSavedRooms() {
  const { isAuthenticated, role } = useAuth()
  const [savedIds, setSavedIds] = useState([])

  useEffect(() => {
    if (isAuthenticated && role === 'CUSTOMER') {
      savedRoomApi
        .listMyRoomIds()
        .then((res) => setSavedIds(res.data))
        .catch(() => {})
    }
  }, [isAuthenticated, role])

  const isSaved = useCallback((roomId) => savedIds.includes(roomId), [savedIds])

  const setSaved = useCallback((roomId, saved) => {
    setSavedIds((prev) => (saved ? [...prev, roomId] : prev.filter((id) => id !== roomId)))
  }, [])

  return { isSaved, setSaved }
}
