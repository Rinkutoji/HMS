import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#7690a3', '#455d71', '#a3b4c2', '#32414d', '#c9d3dc']

export default function BookingChart({ data }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, value: Number(value) }))

  if (!chartData.some((d) => d.value > 0)) {
    return <p className="py-8 text-center text-sm text-slate-400">No booking data yet</p>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
