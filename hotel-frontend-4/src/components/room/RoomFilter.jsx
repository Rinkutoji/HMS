export default function RoomFilter({ filters, onChange, roomTypes }) {
  const update = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:flex-wrap">
      <div className="flex-1 min-w-[160px]">
        <label className="label">Room type</label>
        <select
          className="input"
          value={filters.roomTypeId || ''}
          onChange={(e) => update('roomTypeId', e.target.value || undefined)}
        >
          <option value="">All types</option>
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-32">
        <label className="label">Min price</label>
        <input
          type="number"
          min="0"
          className="input"
          value={filters.minPrice || ''}
          onChange={(e) => update('minPrice', e.target.value || undefined)}
        />
      </div>

      <div className="w-32">
        <label className="label">Max price</label>
        <input
          type="number"
          min="0"
          className="input"
          value={filters.maxPrice || ''}
          onChange={(e) => update('maxPrice', e.target.value || undefined)}
        />
      </div>

      <div className="w-32">
        <label className="label">Guests</label>
        <input
          type="number"
          min="1"
          className="input"
          value={filters.minCapacity || ''}
          onChange={(e) => update('minCapacity', e.target.value || undefined)}
        />
      </div>
    </div>
  )
}
