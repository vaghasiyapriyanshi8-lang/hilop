'use client';

import { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  Mail, 
  Globe, 
  Lock,
  Moon,
  Sun,
  Palette,
  CheckCircle2,
  Save,
  Loader2
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings updated successfully');
    }, 1000);
  };

  const sections = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
    { id: 'smtp', label: 'Email (SMTP)', icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your application configuration and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-2 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all',
                  activeSection === section.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </button>
            </div>

            <div className="p-8 space-y-8">
              {activeSection === 'general' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">App Name</label>
                      <input type="text" defaultValue="Hilop Luxury" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Support Email</label>
                      <input type="email" defaultValue="support@hilop.com" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Default Currency</label>
                      <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                      <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>UTC (GMT+0)</option>
                        <option>EST (GMT-5)</option>
                        <option>PST (GMT-8)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-4">
                     <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Maintenance Mode</h4>
                     <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                              <Settings className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-amber-900 dark:text-amber-400">Disable Frontend</p>
                              <p className="text-xs text-amber-700 dark:text-amber-500">Redirect users to a maintenance page while you perform updates.</p>
                           </div>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none">
                           <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                        </button>
                     </div>
                  </div>
                </div>
              )}

              {activeSection === 'appearance' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                     <h4 className="text-sm font-bold text-gray-900 dark:text-white">Color Scheme</h4>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <button className="flex items-center justify-between p-4 border-2 border-blue-600 rounded-xl bg-white text-gray-900 shadow-sm">
                           <div className="flex items-center gap-2">
                              <Sun className="w-4 h-4" />
                              <span className="text-sm font-medium">Light</span>
                           </div>
                           <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-900 text-white">
                           <div className="flex items-center gap-2">
                              <Moon className="w-4 h-4" />
                              <span className="text-sm font-medium">Dark</span>
                           </div>
                        </button>
                        <button className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-800 text-gray-300">
                           <div className="flex items-center gap-2 text-sm font-medium">
                              <Globe className="w-4 h-4" />
                              System
                           </div>
                        </button>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-sm font-bold text-gray-900 dark:text-white">Accent Color</h4>
                     <div className="flex flex-wrap gap-4">
                        {['bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600'].map((color) => (
                           <button key={color} className={cn('w-8 h-8 rounded-full', color, color === 'bg-blue-600' ? 'ring-2 ring-offset-2 ring-blue-600' : '')} />
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="space-y-6">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                           <Lock className="w-5 h-5 text-blue-600" />
                           <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                              <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                           </div>
                        </div>
                        <button className="text-sm font-bold text-blue-600 hover:underline">Enable</button>
                      </div>

                      <div className="pt-4">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Change Password</h4>
                        <div className="space-y-4 max-w-md">
                           <div className="space-y-2">
                              <label className="text-sm text-gray-600 dark:text-gray-400">Current Password</label>
                              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm text-gray-600 dark:text-gray-400">New Password</label>
                              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none" />
                           </div>
                           <button className="text-sm font-bold text-blue-600 hover:underline">Update Password</button>
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
