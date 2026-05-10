# Hilop Ecommerce Ecosystem

A premium watch brand platform with a React Native mobile app, Node.js backend API, and Next.js admin dashboard.

## Architecture

- `backend/`: Express + MongoDB + Redis + Socket.io + JWT authentication
- `admin/`: Next.js App Router admin panel built with Tailwind CSS and Zustand
- `mobile/`: React Native CLI app with TypeScript, React Navigation, React Query, and Zustand

## Deployment

- `docker-compose up --build` to start backend, MongoDB, and Redis.
- `backend/pm2.config.js` for production process management.
- `admin/` is ready for Vercel deployment with environment variables.

## Standards

- Clean architecture with modular domains
- Role-based authorization and secure middleware
- Environment-driven configuration
- Production-ready build and runtime scaffolding
