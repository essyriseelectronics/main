import { getSettings } from '@/lib/actions/settings';
import SettingsClient from './SettingsClient';

export const metadata = {
  title: 'Settings - Admin Dashboard',
};

export default async function SettingsPage() {
  // Fetch the latest settings from D1
  const settings = await getSettings();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage global configurations, contact details, and system maintenance.
        </p>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  );
}
