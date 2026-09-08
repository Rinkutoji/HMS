import { useEffect, useState } from 'react'
import { imageApi } from '../../api/imageApi'
import { useUpload } from '../../hooks/useUpload'
import MultipleImageUpload from '../../components/upload/MultipleImageUpload'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'

export default function HotelImagePage() {
  const [images, setImages] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const { files, previews, error, addFiles, removeFile, clear } = useUpload()

  const load = () => {
    setLoading(true)
    imageApi
      .listPublic()
      .then((res) => setImages(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleUpload = async () => {
    setUploading(true)
    try {
      await imageApi.upload(files, caption)
      clear()
      setCaption('')
      load()
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async (id) => {
    await imageApi.remove(id)
    load()
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-800">Hotel Images</h1>
      <p className="mt-1 text-sm text-slate-500">Photos shown on the homepage and gallery.</p>

      <div className="card mt-5 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Current Images</h2>
        {loading ? (
          <Loader />
        ) : images?.length ? (
          <div className="flex flex-wrap gap-3">
            {images.map((img) => (
              <div key={img.id} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-slate-200">
                <img src={img.imageUrl} alt={img.caption || ''} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemove(img.id)}
                  className="absolute inset-x-0 bottom-0 bg-slate-900/70 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No hotel images yet" />
        )}
      </div>

      <div className="card mt-5 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Add Images</h2>
        <div className="mb-3">
          <label className="label">Caption (optional, applies to this batch)</label>
          <input className="input" value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>
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
