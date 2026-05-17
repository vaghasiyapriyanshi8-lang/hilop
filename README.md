# Hilop — Ecommerce Platform

This repository contains the Hilop ecommerce ecosystem: a Node.js API backend, a Next.js storefront frontend, a Next.js admin dashboard, and a React Native mobile app.

Overview
- Backend: API server (TypeScript, Express, MongoDB, Redis, Socket.io). See [backend/package.json](backend/package.json#L1).
- Frontend: Next.js storefront (app directory). See [frontend/package.json](frontend/package.json#L1).
- Admin: Next.js admin dashboard. See [admin/package.json](admin/package.json#L1).
- Mobile: React Native app in `hilop_mobile/`. See [hilop_mobile/package.json](hilop_mobile/package.json#L1).

Quick start (local, development)

1. Prerequisites
- Node.js (recommended 18+; the mobile app lists `node >= 22.11.0`), npm, Docker (for services) and Yarn/PNPM optional.

2. Start backend + infra with Docker

```bash
# from repository root
docker-compose up --build
```

This will start `backend` (port 4000), `mongo`, and `redis` as defined in [docker-compose.yml](docker-compose.yml#L1).

3. Run services locally

- Backend (dev)

```bash
cd backend
npm install
# copy and edit environment variables
cp .env.example .env
npm run dev
```

Useful backend scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run seed` (see [backend/package.json](backend/package.json#L1)).

- Frontend (dev)

```bash
cd frontend
npm install
npm run dev       # starts on port 3000
```

Helpful: `npm run clean` removes the `.next` build output.

- Admin (dev)

```bash
cd admin
npm install
npm run dev       # starts on port 3001
```

- Mobile (React Native)

```bash
cd hilop_mobile
npm install
# Metro
npm run start
# Run on emulator/device
npm run android
npm run ios
```

Project structure (high level)
- `backend/` — API server, seeds, config, and PM2 config for production.
- `frontend/` — Next.js storefront (app directory, API usage via `lib/api.ts`).
- `admin/` — Next.js admin dashboard for internal management.
- `hilop_mobile/` — React Native app used on mobile devices.
- `docker-compose.yml` — Dev docker stack: backend, mongo, redis.

Notes & conventions
- Local public site images live in `frontend/public/images` — the repository has migrated local fallbacks to SVGs; dynamic product images are served from the remote image provider (Cloudinary).
- Environment variables: each service exposes an example file (`.env.example`) — copy to `.env` and configure secrets before running in production.
- Linting & formatting: services include `lint` and `format` scripts where applicable.

Troubleshooting & common tasks
- If you see stale references to removed assets, clear the Next.js build cache:

```bash
cd frontend
npm run clean
npm run dev
```

- To seed backend sample data:

```bash
cd backend
npm run seed
```

Contributing
- Follow existing code style and run linters before PRs.
- Add tests where appropriate and keep changes scoped to a single service when possible.

Further reading
- See service READMEs if present: `backend/README.md`, `frontend/README.md`, `admin/README.md`, `hilop_mobile/README.md`.

Contact
- For repository-specific questions, open an issue or contact the maintainers.

Next steps
- Run the development servers locally or start the Docker stack. I can also (optionally) run the frontend dev server now and validate pages if you want.

