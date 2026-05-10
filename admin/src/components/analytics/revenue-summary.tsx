import React from 'react';

const metrics = [
  { label: 'Revenue', value: '$1.4M', change: '+12%' },
  { label: 'Orders', value: '6.2k', change: '+9%' },
  { label: 'Customers', value: '2.9k', change: '+18%' },
  { label: 'Conversion', value: '7.4%', change: '+1.4%' },
];

export function AnalyticsSummary() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/10 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">{metric.label}</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-3xl font-semibold text-white">{metric.value}</p>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">{metric.change}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
