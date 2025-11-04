## Task Management App — Frontend (Next.js)

### Goal
- **Build a modern, responsive, real‑time task management UI** that’s easy to use, fast, 
and production‑leaning.
- Showcase clean architecture with clear separation of concerns, strong typing, and 
great UX on desktop and mobile.

### Assignment mapping (at a glance)
- **Core requirements**
  - [x] Create a login page (dummy login accepted)
  - [x] Display My Tasks page after login
  - [x] View, add, update, delete tasks
  - [x] Filter by status (all/active/completed)
- **Bonus points**
  - [x] Data fetching via **SWR** (transport cache, revalidation control)
  - [x] UX polish (loading skeletons, empty states, toast notifications)
  - [x] Fully responsive with **Tailwind CSS**
- **Advanced challenge (optional)**
  - [x] Pagination and sorting on `/tasks`
  - [x] WebSocket support for real‑time updates
  - [x] Sub‑tasks support (typed model + UI handling)
  - [x] `/api/stats` integration for per‑user completion summary

### Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Data**: SWR for fetching/cache, REST APIs, WebSocket realtime sync
- **State**: Zustand (task UI state), Context API (auth session)
- **Styling**: Tailwind CSS v4, tailwind-merge
- **HTTP Client**: Minimal, typed client built on `fetch` with an Axios‑like interface
- **Testing**: Jest 29, React Testing Library
- **Linting**: ESLint 9, eslint-config-next

### Pages & Navigation
- `/login` — Authentication (first login auto‑creates the user; dummy login path supported)
- `/` — My Tasks dashboard: Kanban‑style status columns + table view
- `/page/[page]?sort=asc|desc` — Server pagination & sorting
- `/task-detail/[id]` — Detail, edit, and delete with responsive modal/bottom‑sheet
- `/stats` — Personal totals by status (todo, inProgress, done, overall)

### How the requirements are met (in depth)
- **Authentication**
  - Dummy login accepted; first login creates the account via backend.
  - JWT stored in `localStorage`; attached as `Authorization: Bearer <token>`.
  - Protected routes via `AuthContext` and guarded layouts.
- **Tasks CRUD + status filtering**
  - Create, read, update, delete via typed services; status‑only `PATCH` supported.
  - Status filter toggles between `all | active | completed` and integrates with the dashboard and table.
  - Pagination/sorting on the server; when client filters are applied, we switch to client pagination for snappy UX.
- **Data fetching with hooks**
  - `useState`/`useEffect` used across UI components.
  - **SWR** powers transport caching, deduplication, and controlled revalidation.
  - Centralized HTTP client (Axios‑style) ensures consistent headers, errors, and types.
- **Realtime updates**
  - WebSocket client triggers **debounced SWR revalidation**.
  - **BroadcastChannel** keeps multiple browser tabs in perfect sync.
- **Polished UX**
  - Loading skeletons, optimistic interactions where safe, and actionable empty/error states.
  - Toast notifications for success/failure, form validation, and destructive actions.
  - Mobile‑first: desktop modal and mobile bottom‑sheet create/edit experience.

### System Design Overview (Frontend)
- **Data fetching**: SWR keys mirror REST endpoints; focus/reconnect revalidation tuned to avoid noise.
- **Realtime**: Lightweight WebSocket per session; events invalidate only affected resources.
- **State**: `Zustand` maintains task UI state when client filtering is enabled to minimize network traffic.
- **Auth**: `AuthContext` owns the session; FE passes password hash to a backend that stores bcrypt of that hash.

### API & Realtime Contracts (used by FE)
- REST base URL: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8008`)
- Endpoints
  - `POST /api/login`
  - `GET /api/tasks?page=&limit=&sort=`
  - `GET /api/tasks/:id`
  - `POST /api/tasks`
  - `PUT /api/tasks/:id`
  - `PATCH /api/tasks/:id/status`
  - `DELETE /api/tasks/:id`
  - `GET /api/stats/:userid`
- WebSocket
  - `GET /api/ws?token=<JWT>` (token in query string, issued at login)

### How to Run
1) Install dependencies
```bash
pnpm install
```

2) Configure environment (optional if using defaults)
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8008
```

3) Start dev server
```bash
pnpm dev
```
Open `http://localhost:3000`.

### Testing & Quality
```bash
pnpm test           # unit tests
pnpm test:watch     # watch mode
pnpm test:coverage  # coverage report (see coverage/index.html)
```
- Strong coverage for services, realtime client, and key UI.
- ESLint ensures consistent, maintainable code throughout the project.

### Reviewer checklist (Frontend)
- Clear Next.js structure with typed services and hooks.
- Robust data fetching + pagination/sorting paths.
- Real‑time invalidation via WebSocket events (debounced, scoped).
- Integrated error reporting, empty/loading states, and responsive design.

### Folder Structure (high‑level)
- `app/` — App Router pages and layouts
- `components/` — Reusable UI (TaskListStatusDashboard, modals, layout)
- `lib/`
  - `services/` — API clients (`task.service`, `auth.service`, `stats.service`, centralized `api` client)
  - `realtime/` — WebSocket client + `useRealtime` hook
  - `store/` — Zustand store for tasks/UI
  - `hooks/` — SWR wrappers and UI hooks
  - `utils/` — Date formatting, id & sort helpers

### Notes
- Ensure the backend runs at `NEXT_PUBLIC_API_URL` and CORS allows the frontend origin.
- WebSocket server must match the API base URL (same host, `/api/ws`).
