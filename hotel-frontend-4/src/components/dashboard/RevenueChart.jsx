import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function RevenueChart({ data }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, revenue: Number(value) }))

  if (!chartData.length) {
    return <p className="py-8 text-center text-sm text-slate-400">No revenue data yet</p>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
        <Tooltip formatter={(value) => `$${value}`} />
        <Bar dataKey="revenue" fill="#455d71" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
