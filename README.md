## Task Management App — Frontend (Next.js)

### Goal
- **Build a modern, responsive, real‑time task management UI** that’s easy to use, fast, and production‑leaning.
- Showcase clean architecture with clear separation of concerns, strong typing, and great UX on desktop and mobile.

### Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Data**: SWR (fetching/cache), REST APIs, WebSocket realtime sync
- **State**: Zustand (task store), Context API (auth)
- **Styling**: Tailwind CSS v4, tailwind-merge
- **Testing**: Jest 29, React Testing Library
- **Linting**: ESLint 9, eslint-config-next

### Pages & Navigation
- `/login` — Authentication screen (signup-on-first-login)
- `/` — Boards dashboard: task list with status columns and table view
- `/page/[page]?sort=asc|desc` — Server pagination & sorting
- `/task-detail/[id]` — Task detail with edit/delete, side panel
- `/stats` — My status counts (todo, inProgress, done, total)

### Features & Engineering Highlights
- **Authentication**
  - Login with username and password; first login auto‑creates the user.
  - JWT stored in `localStorage`; protected routes via `AuthContext` and guarded layouts.
- **Tasks CRUD**
  - Create, read, update, delete; status‑only update endpoint support.
  - Server pagination/sorting by created time; client filtering switches to client‑side pagination automatically.
  - Task types with rules: `story` (no parent), `subtask`/`defect` (require `projectId` pointing to a story).
- **Realtime updates**
  - WebSocket client with **debounced SWR revalidation** and **BroadcastChannel** to sync multiple tabs.
- **Mobile‑first UX**
  - Modal on desktop, bottom‑sheet on mobile for create/edit.
  - Prominent actions, responsive layout, clear loading/error states.

### System Design Overview (Frontend)
- **Data fetching**: SWR keys match REST endpoints; disabled focus/reconnect revalidation to avoid noise.
- **Realtime**: Lightweight WebSocket client per session; events trigger debounced cache invalidation.
- **State**: Global task store (`Zustand`) used when client filtering is active to fetch full dataset once.
- **Auth**: `AuthContext` holds session; FE sends SHA‑256 of password to backend which stores bcrypt of that hash.

### API & Realtime Contracts (used by FE)
- REST base URL: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8008`)
- Endpoints used:
  - `POST /api/login`
  - `GET /api/tasks?page=&limit=&sort=`
  - `GET /api/tasks/:id`
  - `POST /api/tasks`
  - `PUT /api/tasks/:id`
  - `PATCH /api/tasks/:id/status`
  - `DELETE /api/tasks/:id`
  - `GET /api/stats/:userid`
- WebSocket: `GET /api/ws?token=<JWT>` (token via query param in browser)

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

### Testing
```bash
pnpm test           # run unit tests
pnpm test:watch     # watch mode
pnpm test:coverage  # coverage report
```

### Folder Structure (high‑level)
- `app/` — App Router pages and layouts
- `components/` — Reusable UI units (TaskListStatusDashboard, modals, layout)
- `lib/`
  - `services/` — API clients (`task.service`, `auth.service`, `stats.service`)
  - `realtime/` — WebSocket client and hook
  - `store/` — Zustand store for tasks
  - `hooks/` — SWR wrappers and UI hooks
  - `utils/` — Date formatting, id & sort helpers

### Notes
- Ensure the backend runs at `NEXT_PUBLIC_API_URL` and CORS allows the frontend origin.
- WebSocket server must match the API base URL (same host, `/api/ws`).
