import { NavLink } from 'react-router-dom'

export default function Sidebar({ title, items }) {
  return (
    <aside className="hidden w-48 shrink-0 border-r border-slate-200 bg-white md:block">
      <div className="px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      </div>
      <nav className="space-y-2 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}