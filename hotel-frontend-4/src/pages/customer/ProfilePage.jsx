import { useEffect, useState } from 'react'
import { customerApi } from '../../api/customerApi'
import { useAuth } from '../../hooks/useAuth'
import ProfileForm from '../../components/forms/ProfileForm'
import Loader from '../../components/common/Loader'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const { updateUser } = useAuth()

  useEffect(() => {
    customerApi
      .getProfile()
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (values) => {
    setSaving(true)
    setMessage('')
    try {
      const res = await customerApi.updateProfile(values)
      setProfile(res.data)
      updateUser(res.data)
      setMessage('Profile updated successfully')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader className="py-24" />
  if (!profile) return null

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-slate-800">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">{profile.email}</p>

      <div className="card mt-6 p-6">
        {message && <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
        <ProfileForm defaultValues={profile} onSubmit={handleSubmit} loading={saving} />
      </div>
    </div>
  )
}
