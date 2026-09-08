import { UploadCloud } from 'lucide-react'
import ImagePreview from './ImagePreview'
import UploadValidation from './UploadValidation'

export default function MultipleImageUpload({ previews, error, onAddFiles, onRemove, onSubmit, loading }) {
  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 hover:border-brand-400">
        <UploadCloud className="h-5 w-5" />
        Click to add images (JPEG, PNG, WEBP - up to 5MB each)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files?.length && onAddFiles(e.target.files)}
        />
      </label>

      <UploadValidation error={error} />

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((src, i) => (
            <ImagePreview key={src} src={src} onRemove={() => onRemove(i)} />
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <button type="button" onClick={onSubmit} className="btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : `Upload ${previews.length} image${previews.length > 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  )
}
