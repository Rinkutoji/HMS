import { useCallback, useEffect, useState } from 'react'
import { savedRoomApi } from '../../api/savedRoomApi'
import RoomCard from '../../components/room/RoomCard'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'

export default function SavedRoomsPage() {
  const [savedRooms, setSavedRooms] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    savedRoomApi
      .listMine()
      .then((res) => setSavedRooms(res.data))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Saved Rooms</h1>
      <p className="mt-1 text-sm text-slate-500">Rooms you&apos;ve saved for later.</p>

      <div className="mt-5">
        {loading ? (
          <Loader />
        ) : savedRooms?.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {savedRooms.map((sr) => (
              <RoomCard key={sr.id} room={sr.room} />
            ))}
          </div>
        ) : (
          <EmptyState title="No saved rooms yet" description="Tap the heart icon on any room to save it here." />
        )}
      </div>
    </div>
  )
}
