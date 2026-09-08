import { useEffect, useState } from 'react'
import { userManagementApi } from '../../api/userManagementApi'
import SearchBar from '../../components/common/SearchBar'
import Pagination from '../../components/common/Pagination'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { useDebounce } from '../../hooks/useDebounce'

export default function CustomerListPage() {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const debouncedKeyword = useDebounce(keyword)

  useEffect(() => {
    setLoading(true)
    userManagementApi
      .staffViewCustomers({ keyword: debouncedKeyword || undefined, page, size: 10 })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [debouncedKeyword, page])

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
                  <span className={`text-xs font-medium ${c.active ? 'text-emerald-600' : 'text-red-500'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
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
