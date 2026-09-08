import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/authApi'
import { useAuth } from '../../hooks/useAuth'
import RegisterForm from '../../components/forms/RegisterForm'

export default function CustomerRegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async ({ confirmPassword, ...values }) => {
    setLoading(true)
    setError('')
    try {
      const res = await authApi.customerRegister(values)
      login(res.data)
      navigate('/customer/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-800">Create your account</h1>
      <p className="mt-1 text-sm text-slate-500">Book rooms and manage your stays.</p>

      <div className="card mt-6 p-6">
        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <RegisterForm onSubmit={handleSubmit} loading={loading} />
      </div>

      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
