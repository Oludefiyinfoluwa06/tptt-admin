# TPTT Admin

Admin web dashboard for the **Travel & Tours Management** platform. Lets agency staff manage travel packages, review booking and visa requests, view uploaded documents, and send notifications to customers. Talks to the [tptt-api](../tptt-api) backend — the same API the [tptt-mobile](../tptt-mobile) app uses.

Admin accounts are provisioned out-of-band (there's no self-service admin sign-up); this app only has a login page. A user whose account isn't `role: "admin"` is rejected at login even if their credentials are otherwise valid.

## Tech Stack

- Next.js (App Router) + TypeScript
- [Mantine](https://mantine.dev/) — component library (AppShell, forms, tables, notifications)
- Axios + TanStack Query for API calls and server-state caching
- `localStorage` for persisting the auth token (client-side only, like the mobile app's approach)

## Project Structure

```
app/
├── layout.tsx              # Root layout: Mantine + fonts + Providers
├── page.tsx                  # Redirects to /dashboard or /login based on auth state
├── login/page.tsx             # Login page (admin-only gate)
└── (dashboard)/                 # Route group: AppShell + auth guard
    ├── layout.tsx                 # Sidebar nav + header + auth redirect
    ├── dashboard/page.tsx           # Overview stat cards
    ├── customers/page.tsx
    ├── packages/page.tsx
    ├── bookings/page.tsx
    ├── visa-requests/page.tsx
    ├── documents/page.tsx
    └── notifications/page.tsx
api/                # Axios-backed API functions per resource
lib/                  # api-client.ts (axios instance + JWT interceptor), auth-storage.ts
context/                # auth-context.tsx (AuthProvider, useAuth)
components/               # Shared UI: nav-links config, StatCard, PlaceholderPage
providers.tsx               # Client wrapper: MantineProvider + QueryClientProvider + AuthProvider
```

Unlike the mobile app, Next.js only turns a folder into a route when it contains a `page.tsx` or `route.ts` — a stray file colocated in `app/` is never accidentally routable — so page implementations live directly in their `page.tsx` files instead of being re-exported from elsewhere.

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy the environment template and point it at your backend
   ```bash
   cp .env.example .env.local
   ```
3. Start the dev server
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the `tptt-api` backend (e.g. `http://localhost:5000/api`) |

## Branch Workflow

Each feature is built on its own `feature/<name>` branch, pushed for review/merge before the next one starts. This README is updated after each feature ships.

## Roadmap

1. ✅ Auth (admin-only login) + dashboard shell (sidebar nav, header, stat-card overview)
2. Customers (list, search)
3. Packages (CRUD)
4. Bookings (list, review, update status)
5. Visa Requests (list, review, update status)
6. Documents (browse uploaded visa documents)
7. Notifications (send to a customer, view sent history)
