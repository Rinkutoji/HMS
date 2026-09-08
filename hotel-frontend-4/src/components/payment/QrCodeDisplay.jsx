import { useEffect, useState } from 'react'
import { QrCode, ZoomIn } from 'lucide-react'
import { qrCodeApi } from '../../api/qrCodeApi'
import Loader from '../common/Loader'
import Modal from '../common/Modal'

export default function QrCodeDisplay() {
  const [qrCodes, setQrCodes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    qrCodeApi
      .listPublic()
      .then((res) => setQrCodes(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader className="py-6" />
  if (!qrCodes || qrCodes.length === 0) return null

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
        <QrCode className="h-4 w-4" />
        Scan to pay
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Scan one of the QR codes below with your banking app, then upload your receipt.
        Click a QR code to view it larger.
      </p>

      <div className="mt-4 flex flex-wrap gap-4">
        {qrCodes.map((qr) => (
          <button
            key={qr.id}
            type="button"
            onClick={() => setSelected(qr)}
            className="group flex w-32 flex-col items-center gap-2 text-center"
          >
            <span className="relative h-32 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white p-1">
              <img
                src={qr.imageUrl}
                alt={`${qr.bankName} QR code`}
                className="h-full w-full object-contain transition-transform duration-150 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-colors duration-150 group-hover:bg-slate-900/10">
                <ZoomIn className="h-5 w-5 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
              </span>
            </span>
            <span className="text-xs font-medium text-slate-600">{qr.bankName}</span>
          </button>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.bankName}>
        {selected && (
          <img
            src={selected.imageUrl}
            alt={`${selected.bankName} QR code`}
            className="mx-auto max-h-[70vh] w-full max-w-sm rounded-lg border border-slate-200 bg-white object-contain p-2"
          />
        )}
      </Modal>
    </div>
  )
}