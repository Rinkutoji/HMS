import { useState } from 'react'
import StarRating from '../room/StarRating'

export default function ReviewForm({ defaultValues, onSubmit, loading }) {
  const [rating, setRating] = useState(defaultValues?.rating || 0)
  const [comment, setComment] = useState(defaultValues?.comment || '')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!rating) {
      setError('Please select a rating')
      return
    }
    setError('')
    onSubmit({ rating, comment })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Your rating</label>
        <StarRating value={rating} size="lg" onChange={setRating} />
      </div>

      <div>
        <label className="label" htmlFor="comment">
          Comment (optional)
        </label>
        <textarea
          id="comment"
          className="input"
          rows={3}
          maxLength={1000}
          placeholder="Share your experience with this room..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Saving...' : defaultValues ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  )
}
