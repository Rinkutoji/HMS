export default function UploadValidation({ error }) {
  if (!error) return null
  return <p className="error-text">{error}</p>
}
