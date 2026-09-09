import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function Sidebar({ title, items }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <div className="border-b border-slate-200 bg-white md:hidden">
        <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-slate-50"
          >
            <span>
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {title}
              </span>
              <span className="mt-0.5 block text-sm font-semibold text-slate-800">
                {items.find((item) => location.pathname === item.to)?.label ||
                  "Navigation"}
              </span>
            </span>
            <ChevronDown
              className={`h-5 w-5 text-slate-500 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {mobileOpen && (
            <nav className="grid gap-1 border-t border-slate-100 py-2">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-50 text-brand-800"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </div>
      <aside className="hidden w-48 shrink-0 border-r border-slate-200 bg-white md:block">
        <div className="px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>
        </div>
        <nav className="space-y-2 px-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
