# React + CancelKit Dashboard

A single-page React application for viewing and managing subscription cancellation data from CancelKit. This dashboard allows vendors to view their cancellation records, export data to CSV, and access monthly PDF compliance reports.

## Features

- **Secure Authentication**: Uses Supabase Magic Link authentication
- **Cancellation Data Table**: Displays sortable table of cancellation records
- **CSV Export**: Export cancellation data to CSV format
- **PDF Archive**: Access monthly compliance reports
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- React (Vite)
- Tailwind CSS
- Supabase (Authentication, Database, Storage)
- React Table for data display
- Date-fns for date formatting
- PapaParse for CSV export

## Prerequisites

- Node.js 16+ and npm
- Supabase account and project

## Setup

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   cd dashboard
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase URL and anon key
   ```bash
   cp .env.example .env
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL migration script in `supabase/migrations/20250525_initial_schema.sql`
   - Set up Magic Link authentication in the Supabase dashboard
   - Create a storage bucket named `audit-reports`

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Database Schema

### Profiles Table
- `id`: UUID (references auth.users)
- `updated_at`: Timestamp
- `vendor_key`: Text
- `email`: Text
- `full_name`: Text
- `avatar_url`: Text

### Cancels Table
- `id`: UUID
- `created_at`: Timestamp
- `userId`: Text
- `time`: Timestamp
- `ip`: Text
- `result`: JSONB
- `vendorKey`: Text

## Deployment

To build the application for production:

```bash
npm run build
```

The build output will be in the `dist` directory, which can be deployed to any static hosting service like Netlify, Vercel, or Firebase Hosting.

## License

MIT.
