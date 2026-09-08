// Admin uses the same management page as Staff (both roles are allowed to
// manage QR codes on the backend). Re-exported here so it renders inside
// AdminLayout at /admin/qr-codes, keeping the admin sidebar consistent.
export { default } from '../staff/PaymentQrCodesPage'
