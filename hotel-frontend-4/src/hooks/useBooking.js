import { useCallback, useState } from 'react'
import { bookingApi } from '../api/bookingApi'

export function useBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const createBooking = useCallback(async (payload) => {
    setLoading(true)
    setError('')
    try {
      const res = await bookingApi.create(payload)
      return res.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const cancelBooking = useCallback(async (id) => {
    setLoading(true)
    setError('')
    try {
      const res = await bookingApi.cancelMine(id)
      return res.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, createBooking, cancelBooking }
}
