import { AnalyticsSummary } from '../components/analytics/revenue-summary';
import { DashboardShell } from '../components/ui/layout-shell';

export default function Page() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Hilop Admin</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          </div>
        </div>
        <AnalyticsSummary />
      </div>
    </DashboardShell>
  );
}
