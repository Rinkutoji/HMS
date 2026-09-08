import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { qrCodeApi } from '../../api/qrCodeApi'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'

export default function PaymentQrCodesPage() {
  const [qrCodes, setQrCodes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [actioning, setActioning] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const load = useCallback(() => {
    setLoading(true)
    qrCodeApi
      .listAll()
      .then((res) => setQrCodes(res.data))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
      setFormError('Only JPEG, PNG or WEBP images are allowed')
      return
    }
    if (selected.size > 5 * 1024 * 1024) {
      setFormError('File must be under 5MB')
      return
    }
    setFormError('')
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const onSubmit = async (values) => {
    if (!file) {
      setFormError('Please choose a QR code image')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      await qrCodeApi.upload(values.bankName, file)
      reset({ bankName: '' })
      setFile(null)
      setPreview(null)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (qr) => {
    setActioning(qr.id)
    try {
      if (qr.active) {
        await qrCodeApi.deactivate(qr.id)
      } else {
        await qrCodeApi.activate(qr.id)
      }
      load()
    } finally {
      setActioning(null)
    }
  }

  const handleDelete = async () => {
    setActioning(deleteTarget.id)
    try {
      await qrCodeApi.remove(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } finally {
      setActioning(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Payment QR Codes</h1>
      <p className="mt-1 text-sm text-slate-500">
        Upload bank QR codes (ABA, ACLEDA, Bakong, etc.) for customers to scan when paying.
      </p>

      <div className="card mt-6 p-5">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Add a QR code</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Bank name</label>
            <input
              className="input max-w-xs"
              placeholder="e.g. ABA Bank"
              {...register('bankName', { required: 'Required' })}
            />
            {errors.bankName && <p className="error-text">{errors.bankName.message}</p>}
          </div>

          <div>
            <label className="label">QR code image</label>
            <div className="flex items-center gap-4">
              {preview && (
                <img src={preview} alt="QR preview" className="h-20 w-20 rounded-lg border border-slate-200 object-contain" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="text-sm text-slate-600"
              />
            </div>
          </div>

          {formError && <p className="error-text">{formError}</p>}

          <button type="submit" className="btn-primary" disabled={saving}>
            <Plus className="h-4 w-4" />
            {saving ? 'Uploading...' : 'Upload QR Code'}
          </button>
        </form>
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader />
        ) : qrCodes?.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qrCodes.map((qr) => (
              <div key={qr.id} className="card p-4">
                <img src={qr.imageUrl} alt={qr.bankName} className="h-40 w-full rounded-lg border border-slate-200 object-contain bg-slate-50" />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800">{qr.bankName}</span>
                  <span className={`text-xs font-medium ${qr.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {qr.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="btn-secondary flex-1 text-xs"
                    disabled={actioning === qr.id}
                    onClick={() => toggleActive(qr)}
                  >
                    {qr.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="btn-ghost h-9 w-9 p-0 text-red-600"
                    disabled={actioning === qr.id}
                    onClick={() => setDeleteTarget(qr)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No QR codes yet" description="Upload one above to get started." />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete QR code?"
        message={`This will permanently remove the "${deleteTarget?.bankName}" QR code.`}
        confirmLabel="Delete"
        danger
        loading={actioning === deleteTarget?.id}
      />
    </div>
  )
}
