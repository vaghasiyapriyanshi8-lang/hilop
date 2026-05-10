# Hilop Frontend - React Website

A premium luxury watch ecommerce website built with Next.js 15, TypeScript, Tailwind CSS, and modern React patterns.

## Features

- **Modern Design**: Premium luxury watch brand theme with green/black/white color scheme
- **Responsive**: Fully responsive design optimized for mobile, tablet, and desktop
- **Authentication**: Complete auth system with login, signup, JWT tokens
- **Products**: Browse, search, filter, and sort luxury watches
- **Shopping Cart**: Persistent cart with local storage
- **Checkout**: Multi-step checkout with address and payment info
- **User Profile**: Profile management, order history, wishlist, settings
- **Performance**: Optimized images, lazy loading, code splitting
- **Animations**: Smooth animations with Framer Motion
- **State Management**: Zustand for global state (auth, cart)
- **API Layer**: Axios with automatic token refresh and interceptors
- **Form Validation**: React Hook Form + Zod validation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **API Client**: Axios + React Query
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Custom + Radix UI

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── page.tsx                 # Home page
│   ├── auth/                    # Authentication pages
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── products/                # Products pages
│   │   └── page.tsx
│   ├── cart/                    # Shopping cart
│   │   └── page.tsx
│   ├── checkout/                # Checkout flow
│   │   └── page.tsx
│   └── profile/                 # User profile
│       └── page.tsx
├── components/
│   ├── layout/
│   │   ├── header.tsx           # Navigation header
│   │   └── footer.tsx           # Footer
│   ├── sections/                # Home page sections
│   │   ├── hero.tsx
│   │   ├── featured-products.tsx
│   │   ├── categories.tsx
│   │   ├── new-arrivals.tsx
│   │   └── flash-sale.tsx
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   └── providers.tsx            # React Query provider
├── lib/
│   ├── api.ts                   # Axios instance with interceptors
│   ├── query-client.ts          # React Query configuration
│   └── utils.ts                 # Utility functions
├── hooks/
│   └── use-toast.ts             # Toast notification hook
├── store/
│   ├── auth.ts                  # Auth store (Zustand)
│   └── cart.ts                  # Cart store (Zustand)
├── services/
│   └── api/
│       ├── auth.ts              # Auth API calls
│       ├── products.ts          # Products API calls
│       ├── orders.ts            # Orders API calls
│       └── users.ts             # Users API calls
├── types/
│   └── index.ts                 # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:4000/api/v1`

### Installation

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
```

### Environment Variables

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Socket.io (optional)
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Key Features Implementation

### 1. Authentication Flow

```typescript
// Login/Signup
- User submits credentials
- API returns accessToken + refreshToken
- Tokens stored in localStorage
- User state stored in Zustand
- Axios interceptor handles token in headers

// Token Refresh
- On 401 response, interceptor triggers refresh
- New token fetched from /auth/refresh
- Original request retried with new token
- If refresh fails, redirect to login
```

### 2. Shopping Cart

```typescript
// Cart Store (Zustand + Persistence)
- Add items with variant support
- Update quantities
- Remove items
- Persist to localStorage
- Calculate totals automatically
```

### 3. Product Search & Filter

```typescript
// Product Listing
- Search by name
- Sort by price/rating/trending
- Filter by category, brand, price range
- Pagination support
- Wishlist integration
```

### 4. Checkout Process

```typescript
// Multi-step Checkout
Step 1: Shipping Address
- Collect customer address info
- Validate form with Zod

Step 2: Payment Method
- Stripe integration ready
- Multiple payment options

Step 3: Review & Confirm
- Order summary display
- Confirm and place order
```

### 5. User Profile Management

```typescript
// Profile Sections
- Edit profile information
- Change password
- View order history
- Manage saved addresses
- Wishlist management
- Account settings
```

## Component Architecture

### Reusable Components

- **Button**: All variants (primary, secondary, ghost, outline)
- **Input**: Text input with validation support
- **Card**: Container component with consistent styling
- **Toast**: Non-intrusive notifications
- **Layout**: Header and Footer

### Section Components (Home Page)

- **Hero**: Large banner with CTA
- **FeaturedProducts**: Product grid with animations
- **Categories**: Shop by category with icons
- **NewArrivals**: Latest products showcase
- **FlashSale**: Limited time deals with countdown

## State Management

### Zustand Stores

```typescript
// Auth Store
useAuthStore() → {
  user, isAuthenticated, isLoading,
  login(), logout(), setLoading(), updateUser()
}

// Cart Store
useCartStore() → {
  items, total, itemCount,
  addItem(), removeItem(), updateQuantity(), clearCart()
}
```

## API Integration

### Service Layer

```typescript
// Organized API calls by resource
services/api/
  ├── auth.ts         // login, signup, refreshToken, logout, etc.
  ├── products.ts     // getProducts, getProduct, search, etc.
  ├── orders.ts       // getOrders, createOrder, getOrder, etc.
  └── users.ts        // updateProfile, addresses, etc.
```

### Axios Configuration

```typescript
// Automatic interceptors
- Add Authorization header
- Handle 401 with token refresh
- Automatic retry on token refresh
- Centralized error handling
```

## Styling

### Tailwind CSS

- Custom color palette with Hilop green
- Responsive breakpoints (mobile-first)
- Dark mode support ready
- Custom animations via tailwind-animate

### Theme Colors

```css
hilop-green: #22c55e
hilop-black: #000000
hilop-white: #ffffff
```

## Performance Optimizations

1. **Image Optimization**: Next.js Image component with Cloudinary
2. **Code Splitting**: Automatic by Next.js
3. **Lazy Loading**: Intersectionobserver for sections
4. **Memoization**: React.memo for heavy components
5. **Query Caching**: React Query stale time configuration
6. **Bundle Size**: Tree-shaking, minification

## Responsive Design

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large: 1280px+

## Error Handling

```typescript
// Global error handling
- API errors caught by axios interceptors
- Toast notifications for user feedback
- Form validation with Zod
- Error boundaries for components
- Graceful degradation
```

## Loading States

- Skeleton loaders
- Button loading spinners
- Form submission states
- Image loading placeholders

## Next Steps

1. **Connect Backend**: Update API_URL in .env.local
2. **Setup Auth**: Test login/signup flow
3. **Product Data**: Replace mock products with API
4. **Payment Integration**: Setup Stripe or Razorpay
5. **Analytics**: Add tracking events
6. **SEO**: Add meta tags and structured data
7. **Testing**: Add unit and E2E tests

## Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow TypeScript strict mode
2. Use component composition over inheritance
3. Keep components small and focused
4. Add proper type definitions
5. Test responsive design

## License

Proprietary - Hilop

## Support

For issues and questions:
- Email: support@hilop.com
- Docs: https://hilop.com/docs
- GitHub: https://github.com/hilop/frontend
