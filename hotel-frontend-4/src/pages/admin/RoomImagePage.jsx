import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { roomApi } from '../../api/roomApi'
import { useUpload } from '../../hooks/useUpload'
import MultipleImageUpload from '../../components/upload/MultipleImageUpload'
import Loader from '../../components/common/Loader'

export default function RoomImagePage() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { files, previews, error, addFiles, removeFile, clear } = useUpload()
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    roomApi
      .getAdmin(id)
      .then((res) => setRoom(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const handleUpload = async () => {
    setUploading(true)
    try {
      await roomApi.uploadImages(id, files)
      clear()
      load()
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveExisting = async (imageId) => {
    await roomApi.deleteImage(id, imageId)
    load()
  }

  if (loading) return <Loader className="py-24" />
  if (!room) return null

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate('/admin/rooms')} className="text-sm text-slate-500 hover:underline">
        &larr; Back to Rooms
      </button>

      <h1 className="mt-2 text-2xl font-semibold text-slate-800">
        Images for Room {room.roomNumber}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{room.roomTypeName}</p>

      <div className="card mt-5 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Current Images</h2>
        {room.images?.length ? (
          <div className="flex flex-wrap gap-3">
            {room.images.map((img) => (
              <div key={img.id} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-slate-200">
                <img src={img.imageUrl} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(img.id)}
                  className="absolute right-1 top-1 rounded-full bg-slate-900/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No images uploaded yet.</p>
        )}
      </div>

      <div className="card mt-5 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Add Images</h2>
        <MultipleImageUpload
          previews={previews}
          error={error}
          onAddFiles={addFiles}
          onRemove={removeFile}
          onSubmit={handleUpload}
          loading={uploading}
        />
      </div>
    </div>
  )
}
