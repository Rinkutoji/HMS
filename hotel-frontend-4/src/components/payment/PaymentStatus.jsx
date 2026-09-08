import { PAYMENT_STATUS } from '../../utils/constants'

export default function PaymentStatus({ status }) {
  const meta = PAYMENT_STATUS[status] || { label: status, color: 'bg-slate-100 text-slate-700' }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${meta.color}`}>
      {meta.label}
    </span>
  )
}
