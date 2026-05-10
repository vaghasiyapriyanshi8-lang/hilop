import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Image,
  Tag,
  Bell,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
    children: [
      { name: 'All Products', href: '/products' },
      { name: 'Add Product', href: '/products/new' },
      { name: 'Categories', href: '/products/categories' },
    ],
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];
