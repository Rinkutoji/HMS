import { useEffect, useState } from 'react'
import { reviewApi } from '../../api/reviewApi'
import { formatDate } from '../../utils/formatDate'
import StarRating from './StarRating'
import Loader from '../common/Loader'
import EmptyState from '../common/EmptyState'
import Pagination from '../common/Pagination'

export default function ReviewList({ roomId }) {
  const [summary, setSummary] = useState(null)
  const [reviews, setReviews] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reviewApi.getRoomSummary(roomId).then((res) => setSummary(res.data))
  }, [roomId])

  useEffect(() => {
    setLoading(true)
    reviewApi
      .listByRoom(roomId, { page, size: 5 })
      .then((res) => setReviews(res.data))
      .finally(() => setLoading(false))
  }, [roomId, page])

  return (
    <div>
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-800">Reviews</h2>
        {summary?.reviewCount > 0 && (
          <span className="flex items-center gap-1.5 text-sm text-slate-500">
            <StarRating value={summary.averageRating} size="md" />
            {summary.averageRating} &middot; {summary.reviewCount} review
            {summary.reviewCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="mt-4">
        {loading ? (
          <Loader />
        ) : reviews?.content?.length ? (
          <>
            <div className="space-y-4">
              {reviews.content.map((review) => (
                <div key={review.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">{review.customerName}</span>
                    <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
                  </div>
                  <div className="mt-1.5">
                    <StarRating value={review.rating} />
                  </div>
                  {review.comment && <p className="mt-2 text-sm text-slate-600">{review.comment}</p>}
                </div>
              ))}
            </div>
            <Pagination pageNumber={reviews.pageNumber} totalPages={reviews.totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState title="No reviews yet" description="Be the first to review this room after your stay." />
        )}
      </div>
    </div>
  )
}
