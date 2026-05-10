'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublicPath = pathname === '/login' || pathname === '/signup';
    
    if (!loading && !isAuthenticated && !isPublicPath) {
      router.push('/login');
    }
    if (!loading && isAuthenticated && isPublicPath) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading || (!isAuthenticated && pathname !== '/login' && pathname !== '/signup')) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
}
