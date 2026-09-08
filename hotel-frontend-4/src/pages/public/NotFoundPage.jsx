import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Compass className="h-10 w-10 text-slate-300" />
      <h1 className="mt-4 text-2xl font-semibold text-slate-800">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  )
}
