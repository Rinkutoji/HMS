import { format, parseISO } from 'date-fns'

export function formatDate(value, pattern = 'MMM d, yyyy') {
  if (!value) return '-'
  const date = typeof value === 'string' ? parseISO(value) : value
  return format(date, pattern)
}

export function formatDateTime(value) {
  return formatDate(value, 'MMM d, yyyy h:mm a')
}

export function toDateInputValue(value) {
  if (!value) return ''
  const date = typeof value === 'string' ? parseISO(value) : value
  return format(date, 'yyyy-MM-dd')
}
