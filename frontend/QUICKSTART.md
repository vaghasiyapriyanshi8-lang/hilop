# Hilop Frontend - Quick Start Guide

## One-Command Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start development server
npm run dev
```

Then open **http://localhost:3000** in your browser.

## Complete Setup Steps

### 1. Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:4000/api/v1`

### 2. Clone/Setup Project
```bash
cd frontend
npm install
```

### 3. Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### 4. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run dev -- -p 3001  # On custom port

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check

# Others
npm run format           # Format with Prettier
```

## Project Structure Quick Reference

```
app/                  → Pages and routes
  └── [page]/page.tsx → Individual pages

components/          → Reusable components
  ├── ui/            → Base UI components
  ├── layout/        → Header, Footer
  └── sections/      → Home page sections

lib/                 → Configuration and utilities
  ├── api.ts        → Axios setup
  └── utils.ts      → Helper functions

store/               → Zustand state stores
  ├── auth.ts       → Authentication
  └── cart.ts       → Shopping cart

services/            → API service layer
  └── api/
      ├── auth.ts   → Auth endpoints
      ├── products.ts → Products
      ├── orders.ts  → Orders
      └── users.ts   → Users

types/               → TypeScript definitions
hooks/               → Custom React hooks
utils/               → Utilities
```

## Key Features Tour

### 1. Home Page
- Hero section with CTA
- Featured products
- Product categories
- New arrivals
- Flash sales
- Footer with links

### 2. Products Page
- Product grid/list
- Search functionality
- Sorting options
- Filtering capabilities
- Product cards with ratings

### 3. Product Details
- Full product information
- Image gallery
- Specifications
- Customer reviews
- Add to cart/wishlist

### 4. Shopping Cart
- View items
- Adjust quantities
- Remove items
- See total price
- Proceed to checkout

### 5. Checkout
- Multi-step process
- Shipping information
- Payment method selection
- Order review
- Order confirmation

### 6. Authentication
- Login page
- Signup page
- JWT token management
- Automatic token refresh
- Protected routes

### 7. User Profile
- Profile information
- Order history
- Saved addresses
- Wishlist
- Account settings

## Common Tasks

### Add a New Page

```typescript
// app/new-page/page.tsx
'use client'

import { motion } from 'framer-motion'

export default function NewPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1>Your Page</h1>
    </motion.div>
  )
}
```

### Call an API Endpoint

```typescript
import { productsService } from '@/services/api/products'
import { useQuery } from '@tanstack/react-query'

export function ProductsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getProducts(),
  })

  if (isLoading) return <div>Loading...</div>

  return <div>{/* render products */}</div>
}
```

### Use Global State

```typescript
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'

export function Component() {
  const { user, isAuthenticated } = useAuthStore()
  const { items, addItem } = useCartStore()

  return <div>{/* use state */}</div>
}
```

### Add Form Validation

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
})

export function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
```

### Add Toast Notification

```typescript
import { useToast } from '@/hooks/use-toast'

export function Component() {
  const { toast } = useToast()

  return (
    <button
      onClick={() => {
        toast({
          title: 'Success',
          description: 'Action completed!',
        })
      }}
    >
      Click me
    </button>
  )
}
```

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### API not connecting
1. Check backend is running on port 4000
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for errors

### Styles not applying
1. Verify Tailwind CSS classes are correct
2. Check `tailwind.config.js` includes all paths
3. Rebuild: `npm run dev`

### Components not showing
1. Check you're using `'use client'` directive
2. Verify imports are correct
3. Check component exports

### Authentication issues
1. Check tokens are stored in localStorage
2. Verify API endpoints are correct
3. Check CORS configuration

## Browser DevTools

### React DevTools
- Install: React Developer Tools extension
- Inspect components and props
- View hooks state

### Redux DevTools (for Zustand)
- Monitor store changes
- Time-travel debugging

## Performance Tips

1. **Images**: Always use Next.js `Image` component
2. **Code**: Keep components small and focused
3. **State**: Use Zustand for global, React Query for server
4. **Memoization**: Use `React.memo` for expensive components
5. **Bundles**: Next.js auto code-splits by route

## Deployment

### To Vercel
```bash
npm i -g vercel
vercel
```

### To Docker
```bash
docker build -t hilop-frontend .
docker run -p 3000:3000 hilop-frontend
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://api.hilop.com/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

## Support & Resources

- **Documentation**: Read `README.md` for detailed info
- **Development Guide**: Check `DEVELOPMENT.md` for patterns
- **Components**: See `components/` for examples
- **Services**: Check `services/api/` for API patterns

## Next Steps

1. Start the dev server
2. Explore the home page
3. Test the products page
4. Try adding items to cart
5. Test authentication
6. Review code structure
7. Customize as needed
8. Connect to your backend

---

**Happy coding! 🚀**

For questions or issues, check the documentation or review the code examples in the repository.
