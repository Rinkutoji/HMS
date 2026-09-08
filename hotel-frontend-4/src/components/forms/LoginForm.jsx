import { useForm } from 'react-hook-form'

export default function LoginForm({ onSubmit, loading, submitLabel = 'Log in' }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="input"
          placeholder="Email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <p className="error-text">{errors.email.message}</p>}
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="input"
          placeholder="••••••••"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <p className="error-text">{errors.password.message}</p>}
      </div>

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Please wait...' : submitLabel}
      </button>
    </form>
  )
}
