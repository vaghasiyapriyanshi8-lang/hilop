'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
  Settings, 
  Shield, 
  Lock,
  Save,
  Loader2,
  Info
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { accentColor } = useSelector((state: RootState) => state.ui);
  const [isSaving, setIsSaving] = useState(false);

  // Unified Settings State
  const [settings, setSettings] = useState({
    appName: 'Hilop Luxury',
    supportEmail: 'support@hilop.com',
    currency: 'USD ($)',
    timezone: 'UTC (GMT+0)',
  });

  useEffect(() => {
    const saved = localStorage.getItem('generalSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('generalSettings', JSON.stringify(settings));
      setIsSaving(false);
      toast.success('Settings updated successfully');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your application configuration and security in one place.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-6 py-2.5 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: accentColor, shadowColor: `${accentColor}40` }}
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* General Information Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">General Information</h3>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">App Name</label>
              <input 
                type="text" 
                value={settings.appName} 
                onChange={(e) => setSettings({...settings, appName: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Support Email</label>
              <input 
                type="email" 
                value={settings.supportEmail} 
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Default Currency</label>
              <select 
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
              <select 
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>UTC (GMT+0)</option>
                <option>EST (GMT-5)</option>
                <option>PST (GMT-8)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security & Password</h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 transition-all" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 transition-all" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
