import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/authApi'
import { useAuth } from '../../hooks/useAuth'
import LoginForm from '../../components/forms/LoginForm'

export default function StaffAdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    setLoading(true)
    setError('')
    try {
      const res = await authApi.staffAdminLogin(values)
      login(res.data)
      navigate(res.data.role === 'ADMIN' ? '/admin/dashboard' : '/staff/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-800">Staff / Admin login</h1>
      <p className="mt-1 text-sm text-slate-500">Access the hotel management panel.</p>

      <div className="card mt-6 p-6">
        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <LoginForm onSubmit={handleSubmit} loading={loading} submitLabel="Log in" />
      </div>
    </div>
  )
}
