# Hilop Ecommerce Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           End Users                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Web Browsers    │    Mobile Apps    │    Admin Users              │
└────────┬──────────────────┬──────────────────────┬────────────────┘
         │                  │                      │
         ▼                  ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Client Applications                            │
├─────────────────────────────────────────────────────────────────────┤
│   Frontend           │    Mobile App        │   Admin Dashboard    │
│  (React/Next.js)     │  (React Native)      │   (Next.js)         │
│  ├── Pages           │  ├── Screens         │  ├── Pages          │
│  ├── Components      │  ├── Components      │  ├── Components     │
│  ├── State (Zustand) │  ├── State (Redux)   │  ├── State (Zustand)│
│  └── Services        │  └── Services        │  └── Services       │
└────────┬──────────────────┬──────────────────────┬────────────────┘
         │                  │                      │
         │  All use Axios   │  with JWT tokens     │
         │                  │                      │
         └──────────────┬───┴──────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │      API Gateway/CORS         │
        │    (Express Middleware)       │
        └───────────────┬───────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Backend API Server                               │
│                  (Node.js/Express)                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │ Auth Routes│  │Product Routes│Orders Routes│ │Payment Routes│   │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘   │
│         │               │              │              │            │
│  ┌──────▼──────────────▼──────────────▼──────────────▼────┐        │
│  │      Middleware Stack                                 │        │
│  │  ├── JWT Authentication                              │        │
│  │  ├── Rate Limiting                                   │        │
│  │  ├── Request Logging                                │        │
│  │  ├── Error Handling                                 │        │
│  │  ├── CORS                                            │        │
│  │  └── Security Headers                               │        │
│  └──────┬──────────────────────────────────────────────┘        │
│         │                                                         │
│  ┌──────▼──────────────────────────────────────────────┐        │
│  │      Service Layer                                  │        │
│  │  ├── Auth Service                                   │        │
│  │  ├── Product Service                                │        │
│  │  ├── Order Service                                  │        │
│  │  ├── Payment Service                                │        │
│  │  ├── Email Service                                  │        │
│  │  └── Notification Service                           │        │
│  └──────┬──────────────────────────────────────────────┘        │
│         │                                                         │
│  ┌──────▼──────────────────────────────────────────────┐        │
│  │      Real-time Layer (Socket.io)                   │        │
│  │  ├── Order Updates                                  │        │
│  │  ├── Inventory Updates                              │        │
│  │  └── Live Notifications                             │        │
│  └──────────────────────────────────────────────────────┘        │
│         │                                                         │
└─────────┼─────────────────────────────────────────────────────────┘
          │
    ┌─────┴─────────────────────────────────┐
    │                                       │
    ▼                                       ▼
┌──────────────────────┐        ┌──────────────────────┐
│   Data Layer         │        │  External Services  │
├──────────────────────┤        ├──────────────────────┤
│  ┌────────────────┐  │        │  ┌────────────────┐  │
│  │  MongoDB       │  │        │  │  Stripe API    │  │
│  │  (Main DB)     │  │        │  │  (Payments)    │  │
│  └────────────────┘  │        │  └────────────────┘  │
│  ┌────────────────┐  │        │  ┌────────────────┐  │
│  │  Redis         │  │        │  │  Razorpay API  │  │
│  │  (Cache)       │  │        │  │  (Payments)    │  │
│  └────────────────┘  │        │  └────────────────┘  │
│  ┌────────────────┐  │        │  ┌────────────────┐  │
│  │  Message Queue │  │        │  │ Cloudinary     │  │
│  │  (Bull/RabbitMQ)  │        │  │ (Image Upload) │  │
│  └────────────────┘  │        │  └────────────────┘  │
└──────────────────────┘        │  ┌────────────────┐  │
                                │  │ SendGrid       │  │
                                │  │ (Email)        │  │
                                │  └────────────────┘  │
                                └──────────────────────┘
```

## Component Architecture (Frontend)

```
App Layout
│
├── Header
│   ├── Logo
│   ├── Search Bar
│   ├── Navigation
│   ├── Cart Icon
│   └── User Menu
│
├── Main Content
│   │
│   ├── Home Page
│   │   ├── Hero Section
│   │   ├── Featured Products
│   │   ├── Categories
│   │   ├── New Arrivals
│   │   └── Flash Sale
│   │
│   ├── Products Page
│   │   ├── Filters
│   │   ├── Product Grid
│   │   └── Pagination
│   │
│   ├── Product Details
│   │   ├── Image Gallery
│   │   ├── Product Info
│   │   ├── Specifications
│   │   ├── Reviews
│   │   └── Add to Cart
│   │
│   ├── Cart Page
│   │   ├── Cart Items
│   │   ├── Summary
│   │   └── Checkout Link
│   │
│   ├── Checkout
│   │   ├── Step 1: Shipping
│   │   ├── Step 2: Payment
│   │   └── Step 3: Review
│   │
│   ├── Auth Pages
│   │   ├── Login
│   │   └── Signup
│   │
│   └── Profile
│       ├── Profile Info
│       ├── Orders
│       ├── Addresses
│       ├── Wishlist
│       └── Settings
│
└── Footer
    ├── Links
    ├── Social Media
    ├── Contact Info
    └── Newsletter
```

## State Management Flow

```
User Action
│
├─ Click Add to Cart
│  └─ → useCartStore.addItem()
│     └─ → Update cart state
│        └─ → Persist to localStorage
│
├─ Login
│  └─ → authService.login()
│     └─ → useAuthStore.login()
│        └─ → Store tokens
│           └─ → axios interceptor adds token
│
├─ API Call
│  └─ → useQuery()
│     └─ → React Query cache
│        └─ → Update component
│           └─ → Re-render UI
│
└─ Toast Notification
   └─ → useToast()
      └─ → Add to toast state
         └─ → Display toast
            └─ → Auto-remove after delay
```

## Authentication Flow

```
User Attempts Login
│
├─ Enter Credentials
│  └─ Validate with Zod
│     └─ Submit to API
│        │
│        ├─ API Validates
│        ├─ Generate JWT Tokens
│        ├─ Return accessToken + refreshToken
│        │
│        └─ Client:
│           ├─ Store tokens in localStorage
│           ├─ Store user in Zustand
│           ├─ axios interceptor adds token to headers
│           └─ Redirect to home
│
API Call with Token
│
├─ axios.get('/protected-endpoint')
│  │
│  └─ Interceptor adds: Authorization: Bearer token
│     │
│     ├─ Server Validates Token
│     │  ├─ Valid → Return data
│     │  │
│     │  └─ Expired (401) → Interceptor handles:
│     │     ├─ Call /auth/refresh with refreshToken
│     │     ├─ Get new accessToken
│     │     ├─ Update localStorage
│     │     ├─ Retry original request
│     │     │
│     │     └─ If refresh fails:
│     │        ├─ Clear tokens
│     │        ├─ Clear user state
│     │        └─ Redirect to login
│     │
│     └─ Other Error (4xx, 5xx) → Show error toast
│
User Logout
│
├─ Click Logout
│  └─ authService.logout()
│     ├─ Clear localStorage
│     ├─ Clear Zustand store
│     ├─ Redirect to login
│     └─ Clear axios header
```

## Data Flow: Add to Cart → Checkout

```
Product Page
│
├─ User clicks "Add to Cart"
│  │
│  └─ handleAddToCart()
│     │
│     ├─ useCartStore.addItem({
│     │    productId: "123",
│     │    name: "Watch",
│     │    price: 999,
│     │    quantity: 1
│     │  })
│     │
│     └─ → Cart State Updated
│        ├─ items: [...]
│        ├─ total: 999
│        ├─ itemCount: 1
│        └─ Saved to localStorage
│
Cart Page
│
├─ Display cart items from Zustand store
│  │
│  ├─ Show total price
│  ├─ Allow quantity changes
│  └─ Allow item removal
│
Checkout Page
│
├─ Fetch cart items from Zustand
│  │
│  ├─ Step 1: Shipping Address Form
│  │  └─ Validate with Zod
│  │
│  ├─ Step 2: Payment Method
│  │  └─ Select payment option
│  │
│  ├─ Step 3: Review Order
│  │  └─ Display order summary
│  │
│  └─ Submit Order
│     │
│     ├─ Create order with API:
│     │  POST /orders
│     │  {
│     │    items: [...],
│     │    shippingAddress: {...},
│     │    paymentMethod: "stripe",
│     │    total: 999
│     │  }
│     │
│     ├─ API processes order
│     ├─ Database stores order
│     ├─ Payment processing
│     │
│     └─ Redirect to confirmation
│        ├─ Clear cart
│        └─ Show success message
```

## Deployment Architecture

```
                 ┌────────────────┐
                 │  DNS Provider  │
                 │  (GoDaddy, etc)│
                 └────────┬───────┘
                          │
                 ┌────────▼───────┐
                 │  CDN / Caching │
                 │  (Cloudflare)  │
                 └────────┬───────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
    ┌────────┐      ┌──────────┐      ┌──────────┐
    │Frontend│      │ Backend  │      │ Admin    │
    │Vercel │      │ Docker   │      │Vercel    │
    │        │      │ K8s      │      │          │
    └───┬────┘      └────┬─────┘      └──────────┘
        │                │
        │                ▼
        │         ┌──────────────┐
        │         │   Docker     │
        │         │  Registry    │
        │         └──────────────┘
        │                │
        │         ┌──────▼──────┐
        │         │  Kubernetes │
        │         │   Cluster   │
        │         └──────┬──────┘
        │                │
        └────────┬───────┘
                 │
        ┌────────▼──────────┐
        │  Load Balancer    │
        │  (Nginx)          │
        └────────┬──────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌────────┐  ┌────────┐  ┌────────┐
│ Pod 1  │  │ Pod 2  │  │ Pod 3  │
│Backend │  │Backend │  │Backend │
└────┬───┘  └────┬───┘  └────┬───┘
     │           │           │
     └───────────┼───────────┘
                 │
     ┌───────────┴──────────┐
     │                      │
     ▼                      ▼
┌──────────┐         ┌──────────┐
│MongoDB   │         │ Redis    │
│ Cluster  │         │ Cluster  │
└──────────┘         └──────────┘
```

## File Structure Organization

```
frontend/
├── app/
│   ├── page.tsx                    # Home
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── products/
│   │   ├── page.tsx               # Products listing
│   │   └── [id]/page.tsx          # Product details
│   ├── cart/
│   │   └── page.tsx               # Shopping cart
│   ├── checkout/
│   │   └── page.tsx               # Checkout flow
│   ├── auth/
│   │   ├── login/page.tsx         # Login page
│   │   └── signup/page.tsx        # Signup page
│   └── profile/
│       └── page.tsx               # User profile
│
├── components/
│   ├── ui/                         # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── toast.tsx
│   ├── layout/                     # Layout components
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── sections/                   # Page sections
│   │   ├── hero.tsx
│   │   ├── featured-products.tsx
│   │   ├── categories.tsx
│   │   ├── new-arrivals.tsx
│   │   └── flash-sale.tsx
│   ├── providers.tsx               # React Query provider
│   └── auth-initializer.tsx        # Auth initialization
│
├── lib/
│   ├── api.ts                      # Axios configuration
│   ├── query-client.ts             # React Query setup
│   └── utils.ts                    # Utilities
│
├── hooks/
│   ├── use-toast.ts
│   ├── use-media-query.ts
│   ├── use-fetch.ts
│   └── use-initialize-auth.ts
│
├── store/
│   ├── auth.ts                     # Auth store (Zustand)
│   └── cart.ts                     # Cart store (Zustand)
│
├── services/
│   └── api/
│       ├── auth.ts                 # Auth API
│       ├── products.ts             # Products API
│       ├── orders.ts               # Orders API
│       └── users.ts                # Users API
│
├── types/
│   └── index.ts                    # Type definitions
│
├── utils/
│   ├── format.ts                   # Format utilities
│   └── storage.ts                  # Storage service
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── .env.example
└── README.md
```

---

This architecture ensures:
- ✅ **Scalability**: Can handle thousands of users
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Performance**: Optimized caching and CDN
- ✅ **Security**: JWT tokens, HTTPS, rate limiting
- ✅ **Reliability**: Redundancy and failover
- ✅ **Flexibility**: Easy to extend and modify

