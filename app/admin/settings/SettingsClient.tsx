'use client';

import { useState, useTransition } from 'react';
import { StoreSettings, toggleMaintenanceMode, updateGeneralSettings } from '@/lib/actions/settings';
import { Save, AlertTriangle, Loader2, Phone, Mail, CheckCircle2, Settings } from 'lucide-react';

export default function SettingsClient({ initialSettings }: { initialSettings: StoreSettings }) {
  // Maintenance Toggle State
  const [isMaintenance, setIsMaintenance] = useState(initialSettings.maintenance_mode);
  const [isPendingToggle, startToggleTransition] = useTransition();

  // General Form State
  const [isPendingForm, startFormTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Handle Maintenance Toggle
  const handleToggle = () => {
    const newValue = !isMaintenance;
    setIsMaintenance(newValue); // Optimistic UI update
    
    startToggleTransition(async () => {
      await toggleMaintenanceMode(newValue);
    });
  };

  // Handle Form Save
  const handleSaveGeneral = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    startFormTransition(async () => {
      const result = await updateGeneralSettings(formData);
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Settings saved!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save settings.' });
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Maintenance Mode Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl flex-shrink-0 ${isMaintenance ? 'bg-red-50' : 'bg-gray-50'}`}>
              <AlertTriangle className={`h-6 w-6 ${isMaintenance ? 'text-red-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Maintenance Mode</h2>
              <p className="text-sm text-gray-500 mt-1">
                When active, the storefront will display a "Coming Soon / Under Maintenance" page to all visitors. Admin users can still navigate the dashboard.
              </p>
            </div>
          </div>

          {/* Custom Tailwind Toggle */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPendingToggle}
            className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0076c0] focus:ring-offset-2 disabled:opacity-50 ${
              isMaintenance ? 'bg-red-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={isMaintenance}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isMaintenance ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        {isMaintenance && (
          <div className="bg-red-50 px-6 py-3 border-t border-red-100">
            <p className="text-sm text-red-600 font-medium flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              Maintenance Mode is currently LIVE. Customers cannot access the store.
            </p>
          </div>
        )}
      </div>

      {/* 2. General Settings Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <Settings className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900">General Configurations</h2>
        </div>

        <form onSubmit={handleSaveGeneral}>
          <div className="p-6 space-y-6">
            
            {message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                <span className="font-medium text-sm">{message.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Support Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="store_phone"
                    defaultValue={initialSettings.store_phone}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
                    placeholder="+256XXXXXXXXX"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Displayed in the footer and on contact pages.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="support_email"
                    defaultValue={initialSettings.support_email}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
                    placeholder="support@essyrise.com"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Used for customer inquiries.</p>
              </div>
            </div>

          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isPendingForm}
              className="flex items-center justify-center py-2.5 px-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-70 transition-colors"
            >
              {isPendingForm ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
