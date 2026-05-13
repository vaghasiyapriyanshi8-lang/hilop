import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './global.css';
import RootProvider from '@/components/providers/root-provider';
import AuthGuard from '@/components/auth/auth-guard';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hilop Admin',
  description: 'Luxury watch dashboard for Hilop operations and analytics.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <RootProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </RootProvider>
      </body>
    </html>
  );
}
