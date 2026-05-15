'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Prevent multiple redirects in quick succession
    if (hasRedirected.current) return;

    const isPublicPath = pathname === '/login' || pathname === '/signup';
    
    if (!loading && !isAuthenticated && !isPublicPath) {
      hasRedirected.current = true;
      router.push('/login');
      return;
    }
    
    if (!loading && isAuthenticated && isPublicPath) {
      hasRedirected.current = true;
      router.push('/dashboard');
      return;
    }
    
    // Reset the flag when authentication state changes
    if (!loading) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Show loading spinner only when checking auth state
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // If not authenticated and trying to access protected route, show nothing (will redirect)
  if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
}
