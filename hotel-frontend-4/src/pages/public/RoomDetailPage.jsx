import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { roomApi } from '../../api/roomApi'
import { useAuth } from '../../hooks/useAuth'
import { useBooking } from '../../hooks/useBooking'
import { useSavedRooms } from '../../hooks/useSavedRooms'
import RoomGallery from '../../components/room/RoomGallery'
import RoomDetails from '../../components/room/RoomDetails'
import ReviewList from '../../components/room/ReviewList'
import SaveButton from '../../components/room/SaveButton'
import BookingForm from '../../components/forms/BookingForm'
import Loader from '../../components/common/Loader'

export default function RoomDetailPage() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const { isAuthenticated, role } = useAuth()
  const { createBooking, loading: booking, error } = useBooking()
  const { isSaved, setSaved } = useSavedRooms()
  const navigate = useNavigate()

  useEffect(() => {
    roomApi
      .getPublic(id)
      .then((res) => setRoom(res.data))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async (values) => {
    const result = await createBooking({
      roomId: values.roomId,
      checkInDate: values.checkInDate,
      checkOutDate: values.checkOutDate,
    })
    setSuccess(result)
  }

  if (loading) return <Loader className="py-24" />
  if (!room) return null

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <RoomGallery images={room.images?.map((img) => img.imageUrl)} alt={room.roomTypeName} />
            <SaveButton
              roomId={room.id}
              saved={isSaved(room.id)}
              onChange={(next) => setSaved(room.id, next)}
              className="absolute right-3 top-3"
            />
          </div>
          <div className="mt-6">
            <RoomDetails room={room} />
          </div>

          <div className="mt-10 border-t border-slate-200 pt-8">
            <ReviewList roomId={room.id} />
          </div>
        </div>

        <div>
          <div className="card sticky top-20 p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">Book this room</h3>

            {success ? (
              <div className="space-y-3 text-sm">
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
                  Booking created! Next, upload your payment receipt to confirm your stay.
                </p>
                <button
                  className="btn-primary w-full"
                  onClick={() => navigate(`/customer/bookings/${success.id}`)}
                >
                  Go to my booking
                </button>
              </div>
            ) : isAuthenticated && role === 'CUSTOMER' ? (
              <>
                {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                <BookingForm room={room} onSubmit={handleBook} loading={booking} />
              </>
            ) : (
              <div className="space-y-3 text-sm text-slate-600">
                <p>Log in as a customer to book this room.</p>
                <button className="btn-primary w-full" onClick={() => navigate('/login')}>
                  Log in to book
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}