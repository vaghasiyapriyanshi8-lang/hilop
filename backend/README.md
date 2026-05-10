# Hilop Backend

Express API server for Hilop ecommerce.

## Features
- JWT auth with refresh tokens
- Role-based authorization
- Mongoose schema models for users, products, orders
- Cloudinary image upload scaffold
- Redis caching setup
- Socket.io real-time order channels
- Rate limiting, Helmet security, validation middleware

## Run locally

1. Copy `.env.example` to `.env`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Build for production: `npm run build`
5. Start production server: `npm start`
