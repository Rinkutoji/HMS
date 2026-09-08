# Hotel Management System - Frontend

React 19 + Vite + Tailwind CSS frontend for the Hotel Management System university project.

## Setup

1. Make sure the backend is running at `http://localhost:8080` (see `hotel-backend/README.md`).
2. Install dependencies:
   ```
   npm install
   ```
3. Run the dev server:
   ```
   npm run dev
   ```
4. Open `http://localhost:5173`

Requests to `/api/**` and `/uploads/**` are proxied to the backend automatically in dev mode (see `vite.config.js`), so no CORS setup is needed locally.

## Default accounts
- Admin: `admin@hotel.com` / `Admin@123` (seeded automatically by the backend)
- Customers self-register from the Home page.
- Staff accounts are created by an Admin from Admin > Manage Staff.
