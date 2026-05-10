# Hilop Frontend - Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start dev server
npm run dev

# Open http://localhost:3000
```

## Development Workflow

### 1. Creating a New Page

```typescript
// app/your-page/page.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function YourPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold">Your Page</h1>
      <Button className="bg-hilop-green hover:bg-hilop-green/90">
        Click me
      </Button>
    </motion.div>
  )
}
```

### 2. Creating a Reusable Component

```typescript
// components/custom/product-card.tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          <p className="text-hilop-green font-bold mb-4">${product.price}</p>
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full bg-hilop-green hover:bg-hilop-green/90"
          >
            Add to Cart
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
```

### 3. Using API Services

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { productsService } from '@/services/api/products'

export function ProductsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getProducts({ page: 1, limit: 10 }),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading products</div>

  return (
    <div className="grid gap-6">
      {data?.data.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### 4. Using State Management

```typescript
'use client'

import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'

export function CartSummary() {
  const { items, total, addItem, removeItem } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()

  return (
    <div>
      <p>Items: {items.length}</p>
      <p>Total: ${total.toFixed(2)}</p>
      {isAuthenticated && <p>User: {user?.email}</p>}
    </div>
  )
}
```

### 5. Form Validation

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(async (data) => {
      // Submit form
    })}>
      <Input {...register('email')} />
      {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      
      <Input type="password" {...register('password')} />
      {errors.password && <p className="text-red-600">{errors.password.message}</p>}

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### 6. Animations

```typescript
import { motion } from 'framer-motion'

// Basic animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>

// Hover animation
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  Interactive content
</motion.div>

// Scroll trigger animation
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
>
  Appears on scroll
</motion.div>

// Stagger children
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ staggerChildren: 0.1 }}
>
  {items.map((item) => (
    <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

### 7. Toast Notifications

```typescript
import { useToast } from '@/hooks/use-toast'

export function MyComponent() {
  const { toast } = useToast()

  return (
    <button
      onClick={() => {
        toast({
          title: 'Success',
          description: 'Item added to cart!',
        })
      }}
    >
      Add to Cart
    </button>
  )
}
```

### 8. Responsive Design

```typescript
export function ResponsiveComponent() {
  return (
    // Mobile first approach
    <div className="
      w-full
      px-4 sm:px-6 lg:px-8              // Padding
      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  // Columns
      gap-4 md:gap-6 lg:gap-8           // Gap
      text-sm md:text-base lg:text-lg   // Text size
    ">
      Responsive content
    </div>
  )
}
```

## Common Patterns

### Protected Route Pattern

```typescript
// app/admin/page.tsx
'use client'

import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
    }
  }, [user, router])

  if (!user || user.role !== 'admin') {
    return <div>Access denied</div>
  }

  return <div>Admin dashboard</div>
}
```

### Conditional Rendering

```typescript
export function Header() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <header>
      {isAuthenticated ? (
        <div>{user?.name}</div>
      ) : (
        <Link href="/auth/login">Sign In</Link>
      )}
    </header>
  )
}
```

### Loading State

```typescript
export function ProductsList() {
  const { data, isLoading, isPending } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getProducts(),
  })

  if (isLoading || isPending) {
    return <SkeletonLoader />
  }

  return <div>{/* content */}</div>
}
```

## Debugging Tips

```typescript
// Console logs
console.log('Debug:', data)

// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// Check store state
const store = useAuthStore.getState()
console.log(store)
```

## Common Issues & Solutions

### Issue: Components not updating
**Solution**: Check if you're using 'use client' directive

### Issue: Styles not applying
**Solution**: Make sure Tailwind classes are correct, check tailwind.config.js

### Issue: API calls failing
**Solution**: Check NEXT_PUBLIC_API_URL in .env.local, ensure backend is running

### Issue: Hydration mismatch
**Solution**: Wrap dynamic components with `dynamic()` or useEffect

### Issue: Images not loading
**Solution**: Check image path, ensure domain is added to next.config.js

## Performance Tips

1. **Use Next.js Image**: Always use `Image` from 'next/image' for optimization
2. **Lazy Load Components**: Use `dynamic()` for heavy components
3. **Memoize Components**: Use `React.memo` for expensive renders
4. **Optimize Queries**: Set appropriate staleTime in React Query
5. **Code Split**: Let Next.js handle automatic code splitting
6. **Monitor Bundle**: Use `npm run build` and check .next/static

## Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage
npm run test -- --coverage
```

## Building for Production

```bash
# Build
npm run build

# Start production server
npm start

# Test build locally
npm run build && npm start
```

## Deployment

### Vercel

```bash
vercel
```

### Docker

```bash
docker build -t hilop-frontend .
docker run -p 3000:3000 hilop-frontend
```

### Environment Variables for Production

```
NEXT_PUBLIC_API_URL=https://api.hilop.com/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

## Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Zod](https://zod.dev)
- [React Query](https://tanstack.com/query)
