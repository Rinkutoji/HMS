import { useState } from 'react'
import { Heart } from 'lucide-react'
import { savedRoomApi } from '../../api/savedRoomApi'
import { useAuth } from '../../hooks/useAuth'

export default function SaveButton({ roomId, saved, onChange, className = '' }) {
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated || role !== 'CUSTOMER') return null

  const toggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      if (saved) {
        await savedRoomApi.unsave(roomId)
        onChange?.(false)
      } else {
        await savedRoomApi.save(roomId)
        onChange?.(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? 'Remove from saved rooms' : 'Save room'}
      aria-pressed={saved}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors duration-150 hover:bg-white ${className}`}
    >
      <Heart className={`h-4 w-4 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
    </button>
  )
}
