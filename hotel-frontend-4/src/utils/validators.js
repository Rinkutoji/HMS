export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const isNotBlank = (value) => typeof value === 'string' && value.trim().length > 0

export const minLength = (value, min) => typeof value === 'string' && value.length >= min
