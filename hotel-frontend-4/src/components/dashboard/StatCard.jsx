export default function StatCard({ label, value, icon: Icon, accent = 'text-brand-700' }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      {Icon && (
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 text-xl font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  )
}
