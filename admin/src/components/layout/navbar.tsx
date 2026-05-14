'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleSidebar } from '@/redux/slices/uiSlice';
import { logout } from '@/redux/slices/authSlice';
import Link from 'next/link';
import { 
  Menu, 
  User, 
  LogOut, 
  Settings 
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

export default function Navbar() {
  const dispatch = useDispatch();
  const { theme, accentColor } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: accentColor }}>
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Manager'}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 md:hidden">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@hilop.com'}</p>
              </div>
              <Link 
                href="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
              <Link 
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
              <button
                onClick={() => dispatch(logout())}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
