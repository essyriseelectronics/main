'use client';

import { useState, useTransition } from 'react';
import { updateProfile, logoutUser } from '@/lib/actions/profile';
import { Loader2, Save, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthUser } from '@/lib/auth/getUser';

export default function ProfileForm({ user }: { user: AuthUser }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Profile updated!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update.' });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                defaultValue={user.first_name}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                defaultValue={user.last_name}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                name="email"
                defaultValue={user.email || ''}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number (Login ID)</label>
              <input
                type="text"
                disabled
                defaultValue={user.phone}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl sm:text-sm cursor-not-allowed"
                title="Phone number cannot be changed"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City / Location</label>
              <input
                type="text"
                name="location"
                defaultValue={user.location || ''}
                placeholder="e.g., Kampala"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Address</label>
              <input
                type="text"
                name="address"
                defaultValue={user.address || ''}
                placeholder="e.g., Ntinda Complex, 2nd Floor"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-[#0076c0] focus:border-[#0076c0] sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-100 flex items-center justify-between">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center py-2.5 px-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#0076c0] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0076c0] disabled:opacity-70 transition-colors"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* Logout Section */}
      <div className="mt-8 flex justify-end">
        <form action={logoutUser}>
          <button
            type="submit"
            className="flex items-center text-red-600 font-semibold text-sm hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
