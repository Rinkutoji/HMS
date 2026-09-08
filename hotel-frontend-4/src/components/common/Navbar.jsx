import { Link, useNavigate } from 'react-router-dom'
import { Hotel, User, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const dashboardPath =
    role === 'ADMIN' ? '/admin/dashboard' : role === 'STAFF' ? '/staff/dashboard' : '/customer/dashboard'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-slate-800">
          <Hotel className="h-5 w-5 text-brand-700" />
          <span className="text-base font-semibold tracking-tight">Grandview Hotel</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          <Link to="/rooms" className="hover:text-slate-900">
            Rooms
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="btn-ghost">
                <User className="h-4 w-4" />
                {user?.firstName}
              </Link>
              <button onClick={handleLogout} className="btn-secondary">
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
