import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShieldCheck, Sparkles, Clock } from 'lucide-react'
import { roomApi } from '../../api/roomApi'
import { imageApi } from '../../api/imageApi'
import RoomCard from '../../components/room/RoomCard'
import Loader from '../../components/common/Loader'

export default function HomePage() {
  const [featuredRooms, setFeaturedRooms] = useState([])
  const [heroImage, setHeroImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.allSettled([roomApi.search({ size: 6 }), imageApi.listPublic()]).then(([roomsRes, imagesRes]) => {
      if (roomsRes.status === 'fulfilled') {
        setFeaturedRooms(roomsRes.value.data.content)
      }
      if (imagesRes.status === 'fulfilled' && imagesRes.value.data.length > 0) {
        setHeroImage(imagesRes.value.data[0].imageUrl)
      }
      setLoading(false)
    })
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(keyword ? `/rooms?keyword=${encodeURIComponent(keyword)}` : '/rooms')
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-900">
        {heroImage && (
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        )}
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-medium uppercase tracking-widest text-brand-200">Grandview Hotel</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold text-white sm:text-5xl">
            A quiet place to rest, in the middle of everything.
          </h1>
          <p className="mt-4 max-w-lg text-brand-100">
            Browse rooms, check availability, and book your stay in minutes.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex max-w-xl gap-2 rounded-xl bg-white p-2 shadow-lg">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by room type or number..."
                className="w-full rounded-lg border-none px-9 py-2.5 text-sm text-slate-800 focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search Rooms
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 shrink-0 text-brand-700" />
            <div>
              <p className="font-medium text-slate-800">Secure booking</p>
              <p className="text-sm text-slate-500">Your reservation is confirmed once payment is verified.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 shrink-0 text-brand-700" />
            <div>
              <p className="font-medium text-slate-800">Clean, modern rooms</p>
              <p className="text-sm text-slate-500">From Standard to VIP, choose what fits your stay.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-6 w-6 shrink-0 text-brand-700" />
            <div>
              <p className="font-medium text-slate-800">Fast check-in</p>
              <p className="text-sm text-slate-500">Our front desk team has your room ready on arrival.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Featured Rooms</h2>
          <Link to="/rooms" className="text-sm font-medium text-brand-700 hover:underline">
            View all rooms
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
