import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { reviewApi } from '../../api/reviewApi'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import BookingStatusBadge from '../../components/booking/BookingStatusBadge'
import PaymentStatus from '../../components/payment/PaymentStatus'
import PaymentPreview from '../../components/payment/PaymentPreview'
import ReceiptUploader from '../../components/payment/ReceiptUploader'
import QrCodeDisplay from '../../components/payment/QrCodeDisplay'
import StarRating from '../../components/room/StarRating'
import ReviewForm from '../../components/forms/ReviewForm'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Loader from '../../components/common/Loader'

export default function BookingDetailPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [payment, setPayment] = useState(null)
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [editingReview, setEditingReview] = useState(false)
  const [savingReview, setSavingReview] = useState(false)
  const navigate = useNavigate()

  const load = useCallback(() => {
    setLoading(true)
    Promise.allSettled([
      bookingApi.myBookingDetail(id),
      paymentApi.getMyStatus(id),
      reviewApi.getMyReview(id),
    ]).then(([bookingRes, paymentRes, reviewRes]) => {
      if (bookingRes.status === 'fulfilled') setBooking(bookingRes.value.data)
      if (paymentRes.status === 'fulfilled') setPayment(paymentRes.value.data)
      if (reviewRes.status === 'fulfilled') setReview(reviewRes.value.data)
      setLoading(false)
    })
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const handleUpload = async (file) => {
    setUploading(true)
    try {
      const res = await paymentApi.uploadReceipt(id, file)
      setPayment(res.data)
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await bookingApi.cancelMine(id)
      setCancelOpen(false)
      load()
    } finally {
      setCancelling(false)
    }
  }

  const handleReviewSubmit = async (values) => {
    setSavingReview(true)
    try {
      const res = review ? await reviewApi.updateReview(id, values) : await reviewApi.createReview(id, values)
      setReview(res.data)
      setEditingReview(false)
    } finally {
      setSavingReview(false)
    }
  }

  if (loading) return <Loader className="py-24" />
  if (!booking) return null

  const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.status)
  const canUpload = booking.status === 'PENDING' && (!payment || payment.status === 'REJECTED')
  const canReview = booking.status === 'CHECKED_OUT'

  return (
    <div className="max-w-2xl space-y-6">
      <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:underline">
        &larr; Back
      </button>

      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              {booking.roomTypeName} &middot; Room {booking.roomNumber}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {formatDate(booking.checkInDate)} &rarr; {formatDate(booking.checkOutDate)}
            </p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">Total price</span>
          <span className="text-lg font-semibold text-slate-800">{formatCurrency(booking.totalPrice)}</span>
        </div>

        {canCancel && (
          <button className="btn-secondary mt-4" onClick={() => setCancelOpen(true)}>
            Cancel booking
          </button>
        )}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Payment</h2>
          {payment && <PaymentStatus status={payment.status} />}
        </div>

        {payment?.receiptImageUrl && (
          <div className="mt-4">
            <PaymentPreview imageUrl={payment.receiptImageUrl} />
          </div>
        )}

        {canUpload && (
          <div className="mt-4 space-y-4">
            <QrCodeDisplay />
            <ReceiptUploader onUpload={handleUpload} loading={uploading} />
          </div>
        )}

        {!payment && !canUpload && booking.status !== 'PENDING' && (
          <p className="mt-3 text-sm text-slate-500">No receipt was submitted for this booking.</p>
        )}
      </div>

      {canReview && (
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-800">Your Review</h2>

          {review && !editingReview ? (
            <div className="mt-4 space-y-3">
              <StarRating value={review.rating} size="md" />
              {review.comment && <p className="text-sm text-slate-600">{review.comment}</p>}
              <button className="btn-secondary" onClick={() => setEditingReview(true)}>
                Edit review
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <ReviewForm defaultValues={review} onSubmit={handleReviewSubmit} loading={savingReview} />
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancel this booking?"
        message="This action cannot be undone."
        confirmLabel="Cancel booking"
        danger
        loading={cancelling}
      />
    </div>
  )
}