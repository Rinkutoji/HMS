import PaymentForm from '../forms/PaymentForm'

export default function ReceiptUploader({ onUpload, loading }) {
  return (
    <div className="card p-5">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Upload payment receipt</h3>
      <PaymentForm onSubmit={onUpload} loading={loading} />
    </div>
  )
}
