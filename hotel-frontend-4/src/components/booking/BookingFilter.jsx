export default function BookingFilter({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="card flex flex-wrap items-end gap-4 p-4">
      <div className="w-48">
        <label className="label">Status</label>
        <select
          className="input"
          value={filters.status || ''}
          onChange={(e) => update('status', e.target.value || undefined)}
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CHECKED_IN">Checked In</option>
          <option value="CHECKED_OUT">Checked Out</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      <div className="w-48">
        <label className="label">Check-in date</label>
        <input
          type="date"
          className="input"
          value={filters.checkInDate || ''}
          onChange={(e) => update('checkInDate', e.target.value || undefined)}
        />
      </div>
    </div>
  )
}
