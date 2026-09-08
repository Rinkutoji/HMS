export default function PaymentPreview({ imageUrl }) {
  if (!imageUrl) return null
  return (
    <a href={imageUrl} target="_blank" rel="noreferrer" className="block w-fit">
      <img
        src={imageUrl}
        alt="Payment receipt"
        className="max-h-64 rounded-lg border border-slate-200 object-contain"
      />
    </a>
  )
}
