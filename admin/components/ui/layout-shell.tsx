import React from 'react';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-emerald-500/5 backdrop-blur-xl">
          {children}
        </div>
      </div>
    </main>
  );
}
