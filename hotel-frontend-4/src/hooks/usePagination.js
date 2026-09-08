import { useState, useCallback } from 'react'

export function usePagination(initialPage = 0, initialSize = 10) {
  const [page, setPage] = useState(initialPage)
  const [size] = useState(initialSize)

  const nextPage = useCallback((totalPages) => {
    setPage((p) => Math.min(p + 1, Math.max(totalPages - 1, 0)))
  }, [])

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 0))
  }, [])

  const goToPage = useCallback((p) => setPage(Math.max(p, 0)), [])

  const reset = useCallback(() => setPage(0), [])

  return { page, size, nextPage, prevPage, goToPage, reset }
}
