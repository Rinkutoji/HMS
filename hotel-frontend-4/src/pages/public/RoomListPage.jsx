import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { roomApi } from '../../api/roomApi'
import { roomTypeApi } from '../../api/roomTypeApi'
import RoomCard from '../../components/room/RoomCard'
import RoomFilter from '../../components/room/RoomFilter'
import Pagination from '../../components/common/Pagination'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useDebounce } from '../../hooks/useDebounce'

export default function RoomListPage() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({ keyword: searchParams.get('keyword') || '' })
  const [roomTypes, setRoomTypes] = useState([])
  const [rooms, setRooms] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const debouncedFilters = useDebounce(filters, 400)

  useEffect(() => {
    roomTypeApi.listPublic().then((res) => setRoomTypes(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    roomApi
      .search({ ...debouncedFilters, status: 'AVAILABLE', page, size: 9 })
      .then((res) => setRooms(res.data))
      .finally(() => setLoading(false))
  }, [debouncedFilters, page])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-800">Browse Rooms</h1>
      <p className="mt-1 text-sm text-slate-500">Filter by type, price, and capacity to find your fit.</p>

      <div className="mt-5">
        <RoomFilter
          filters={filters}
          roomTypes={roomTypes}
          onChange={(next) => {
            setFilters(next)
            setPage(0)
          }}
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader />
        ) : rooms?.content?.length ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.content.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
            <Pagination pageNumber={rooms.pageNumber} totalPages={rooms.totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState title="No rooms match your filters" description="Try widening your search." />
        )}
      </div>
    </div>
  )
}
