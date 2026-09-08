import { useCallback, useEffect, useState } from 'react'
import { userManagementApi } from '../../api/userManagementApi'
import SearchBar from '../../components/common/SearchBar'
import Pagination from '../../components/common/Pagination'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useDebounce } from '../../hooks/useDebounce'

export default function CustomerPage() {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(null)
  const debouncedKeyword = useDebounce(keyword)

  const load = useCallback(() => {
    setLoading(true)
    userManagementApi
      .adminListCustomers({ keyword: debouncedKeyword || undefined, page, size: 10 })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [debouncedKeyword, page])

  useEffect(() => {
    load()
  }, [load])

  const toggleActive = async (customer) => {
    setActioning(customer.id)
    try {
      if (customer.active) {
        await userManagementApi.adminDeactivateCustomer(customer.id)
      } else {
        await userManagementApi.adminActivateCustomer(customer.id)
      }
      load()
    } finally {
      setActioning(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Customers</h1>

      <div className="mt-5 max-w-sm">
        <SearchBar value={keyword} onChange={(v) => { setKeyword(v); setPage(0) }} placeholder="Search by name or email" />
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader />
        ) : data?.content?.length ? (
          <>
            <div className="card divide-y divide-slate-100">
              {data.content.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{c.email}</p>
                  </div>
                  <button
                    className={`text-xs font-medium ${c.active ? 'text-red-600' : 'text-emerald-600'}`}
                    disabled={actioning === c.id}
                    onClick={() => toggleActive(c)}
                  >
                    {c.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              ))}
            </div>
            <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState title="No customers found" />
        )}
      </div>
    </div>
  )
}
