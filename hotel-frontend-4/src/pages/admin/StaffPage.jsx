import { useCallback, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { userManagementApi } from '../../api/userManagementApi'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'

export default function StaffPage() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const load = useCallback(() => {
    setLoading(true)
    userManagementApi
      .adminListStaff({ page, size: 10 })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    load()
  }, [load])

  const toggleActive = async (staff) => {
    setActioning(staff.id)
    try {
      if (staff.active) {
        await userManagementApi.adminDeactivateStaff(staff.id)
      } else {
        await userManagementApi.adminActivateStaff(staff.id)
      }
      load()
    } finally {
      setActioning(null)
    }
  }

  const onCreate = async (values) => {
    setSaving(true)
    setFormError('')
    try {
      await userManagementApi.adminCreateStaff(values)
      setModalOpen(false)
      reset()
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Staff</h1>
        <button
          className="btn-primary"
          onClick={() => {
            reset({ firstName: '', lastName: '', email: '', phone: '', password: '' })
            setFormError('')
            setModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          New Staff Account
        </button>
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader />
        ) : data?.content?.length ? (
          <>
            <div className="card divide-y divide-slate-100">
              {data.content.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{s.email}</p>
                  </div>
                  <button
                    className={`text-xs font-medium ${s.active ? 'text-red-600' : 'text-emerald-600'}`}
                    disabled={actioning === s.id}
                    onClick={() => toggleActive(s)}
                  >
                    {s.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              ))}
            </div>
            <Pagination pageNumber={data.pageNumber} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState title="No staff accounts yet" />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Staff Account"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSubmit(onCreate)} disabled={saving}>
              {saving ? 'Creating...' : 'Create'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First name</label>
              <input className="input" {...register('firstName', { required: 'Required' })} />
              {errors.firstName && <p className="error-text">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="label">Last name</label>
              <input className="input" {...register('lastName', { required: 'Required' })} />
              {errors.lastName && <p className="error-text">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" {...register('email', { required: 'Required' })} />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Phone (optional)</label>
            <input className="input" {...register('phone')} />
          </div>
          <div>
            <label className="label">Temporary password</label>
            <input
              type="password"
              className="input"
              {...register('password', {
                required: 'Required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>
        </div>
      </Modal>
    </div>
  )
}
