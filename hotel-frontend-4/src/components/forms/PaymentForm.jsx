import { useState } from 'react'
import { UploadCloud } from 'lucide-react'

export default function PaymentForm({ onSubmit, loading }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
      setError('Only JPEG, PNG or WEBP images are allowed')
      return
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB')
      return
    }
    setError('')
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please choose a receipt image')
      return
    }
    onSubmit(file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label
        htmlFor="receipt"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:border-brand-400"
      >
        {preview ? (
          <img src={preview} alt="Receipt preview" className="max-h-48 rounded-lg object-contain" />
        ) : (
          <>
            <UploadCloud className="h-8 w-8 text-slate-400" />
            <p className="text-sm text-slate-600">Click to upload your payment receipt</p>
            <p className="text-xs text-slate-400">JPEG, PNG or WEBP, up to 5MB</p>
          </>
        )}
        <input id="receipt" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
      </label>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="btn-primary w-full" disabled={loading || !file}>
        {loading ? 'Uploading...' : 'Submit Receipt'}
      </button>
    </form>
  )
}
