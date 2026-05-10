'use client';

import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { cn } from '@/utils/cn';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      
      <div
        className={cn(
          'transition-all duration-300 min-h-screen flex flex-col',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        )}
      >
        <Navbar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
        
        <footer className="py-6 px-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Hilop Admin. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
