import { useState, useCallback } from 'react'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function useUpload() {
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')

  const addFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList)
    const invalid = incoming.find(
      (f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE,
    )
    if (invalid) {
      setError('Only JPEG, PNG or WEBP images under 5MB are allowed')
      return
    }
    setError('')
    setFiles((prev) => [...prev, ...incoming])
    setPreviews((prev) => [...prev, ...incoming.map((f) => URL.createObjectURL(f))])
  }, [])

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clear = useCallback(() => {
    setFiles([])
    setPreviews([])
    setError('')
  }, [])

  return { files, previews, error, addFiles, removeFile, clear }
}
