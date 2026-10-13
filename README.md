# CanteenGO Frontend

React 18 + Vite frontend for the CanteenGO college food ordering system.

## Features

- **Student Portal**:
  - Registration and login
  - Interactive menu browsing with categories and search
  - Cart management and ordering
  - Order history tracking (Pending → Preparing → Ready → Completed)
- **Admin Portal**:
  - Food catalog management (create, update, toggle availability, delete)
  - Live incoming orders monitor and status updater
- **Protected Routing**: Role-based routing protecting Student and Admin pages.

## Tech Stack

- React 18
- Vite 5
- React Router DOM 6
- Lucide React (icons)

## Environment Variables

Configured via `VITE_API_URL`:

| Variable | Description | Development | Production |
|---|---|---|---|
| `VITE_API_URL` | Backend base URL (without trailing slash) | Leave empty (`""`) to use Vite dev server proxy | Full origin of backend, e.g. `https://canteengo-api.onrender.com` |

See `.env.example` for reference. In local development, you can create a `.env.local` file (git-ignored) if testing against an external API.

## Development & Build

### Install dependencies

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

Runs on `http://localhost:5173`. Proxies `/api` requests to `http://localhost:8080`.

### Production Build

```bash
npm run build
```

Build artifacts will be emitted to `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Deployment on Vercel

The repository includes `vercel.json` configured for Vite SPA routing:
- Output Directory: `dist`
- Build Command: `npm run build`
- Rewrites: Routes non-API paths to `/index.html` while preserving direct API routing (`/((?!api/).*)`).

### Deployment Steps:
1. Import repository into Vercel.
2. In Project Settings > Environment Variables:
   - Add `VITE_API_URL` with your deployed backend URL (e.g., `https://your-backend.onrender.com`).
3. Deploy.
